// Progress tracking service for district imports with SSE support

class ProgressTracker {
    constructor() {
        this.activeImports = new Map();
        this.clients = new Map();
    }

    // Register SSE client for progress updates
    addClient(importId, res) {
        console.log(`🔌 [Progress] Client connecting for import: ${importId}`);
        this.clients.set(importId, res);
        
        // Set up SSE headers
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Cache-Control'
        });

        // Send initial connection event
        this.sendProgress(importId, {
            stage: 'connected',
            message: 'Connected to import progress stream',
            progress: 0
        });

        console.log(`✅ [Progress] Client connected for import: ${importId}`);

        // Handle client disconnect
        res.on('close', () => {
            this.removeClient(importId);
        });
    }

    // Remove client connection
    removeClient(importId) {
        if (this.clients.has(importId)) {
            this.clients.delete(importId);
            console.log(`📡 [Progress] Client disconnected for import: ${importId}`);
        }
    }

    // Initialize new import tracking
    startImport(importId, totalSteps = 100) {
        const importData = {
            id: importId,
            startTime: Date.now(),
            totalSteps,
            currentStep: 0,
            stage: 'initializing',
            message: 'Starting import process...',
            stats: {
                totalRows: 0,
                processedRows: 0,
                buildings: 0,
                flats: 0,
                errors: 0
            }
        };

        this.activeImports.set(importId, importData);
        this.sendProgress(importId, importData);
        
        console.log(`🚀 [Progress] Started tracking import: ${importId}`);
        return importData;
    }

    // Update progress for an import
    updateProgress(importId, updates) {
        if (!this.activeImports.has(importId)) {
            console.warn(`⚠️ [Progress] Import not found: ${importId}`);
            return;
        }

        const importData = this.activeImports.get(importId);
        
        // Merge updates
        Object.assign(importData, updates);
        
        if (updates.stats) {
            Object.assign(importData.stats, updates.stats);
        }

        // Calculate progress percentage
        if (updates.currentStep !== undefined) {
            importData.progress = Math.round((updates.currentStep / importData.totalSteps) * 100);
        }

        // Update timestamp
        importData.lastUpdate = Date.now();
        importData.elapsed = importData.lastUpdate - importData.startTime;

        this.activeImports.set(importId, importData);
        this.sendProgress(importId, importData);

        console.log(`📊 [Progress] ${importId}: ${importData.stage} - ${importData.progress}%`);
    }

    // Send progress update to client
    sendProgress(importId, data) {
        const client = this.clients.get(importId);
        if (client && !client.destroyed) {
            try {
                const eventData = JSON.stringify({
                    ...data,
                    timestamp: Date.now()
                });
                
                client.write(`data: ${eventData}\n\n`);
                console.log(`📡 [Progress] Sent SSE data for ${importId}: ${data.stage} - ${data.progress}%`);
            } catch (error) {
                console.error(`❌ [Progress] Error sending update for ${importId}:`, error.message);
                this.removeClient(importId);
            }
        } else {
            console.warn(`⚠️ [Progress] No client connected for ${importId} (clients: ${this.clients.size})`);
        }
    }

    // Complete an import
    completeImport(importId, finalStats) {
        if (!this.activeImports.has(importId)) return;

        const importData = this.activeImports.get(importId);
        importData.stage = 'completed';
        importData.progress = 100;
        importData.currentStep = importData.totalSteps;
        importData.message = 'Import completed successfully!';
        importData.completed = true;
        importData.endTime = Date.now();
        importData.totalTime = importData.endTime - importData.startTime;
        
        if (finalStats) {
            Object.assign(importData.stats, finalStats);
        }

        this.sendProgress(importId, importData);
        
        // Clean up after a delay
        setTimeout(() => {
            this.activeImports.delete(importId);
            this.removeClient(importId);
        }, 5000);

        console.log(`✅ [Progress] Completed import: ${importId} (${importData.totalTime}ms)`);
    }

    // Fail an import
    failImport(importId, error) {
        if (!this.activeImports.has(importId)) return;

        const importData = this.activeImports.get(importId);
        importData.stage = 'failed';
        importData.message = `Import failed: ${error}`;
        importData.error = error;
        importData.failed = true;
        importData.endTime = Date.now();
        importData.totalTime = importData.endTime - importData.startTime;

        this.sendProgress(importId, importData);
        
        // Clean up after a delay
        setTimeout(() => {
            this.activeImports.delete(importId);
            this.removeClient(importId);
        }, 10000);

        console.log(`❌ [Progress] Failed import: ${importId} - ${error}`);
    }

    // Get import status
    getImportStatus(importId) {
        return this.activeImports.get(importId) || null;
    }
}

// Create singleton instance
const progressTracker = new ProgressTracker();

module.exports = progressTracker;