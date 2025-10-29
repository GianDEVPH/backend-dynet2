// Controller for running database seeders in production environment

const { exec } = require('child_process')
const path = require('path')

const runSeeder = async (req, res) => {
  try {
    const { seederType } = req.params
    
    // Security check - only allow specific seeders
    const allowedSeeders = ['users', 'appointments', 'extended', 'all']
    if (!allowedSeeders.includes(seederType)) {
      return res.status(400).json({ message: 'Invalid seeder type' })
    }

    const seederCommand = `node src/seeders/${getSeederFile(seederType)}`
    
    exec(seederCommand, { cwd: path.join(__dirname, '../..') }, (error, stdout, stderr) => {
      if (error) {
        console.error('Seeder error:', error)
        return res.status(500).json({ 
          message: 'Seeder failed', 
          error: error.message,
          stderr: stderr 
        })
      }
      
      res.json({ 
        message: `${seederType} seeder completed successfully`,
        output: stdout 
      })
    })
  } catch (error) {
    console.error('Seeder controller error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getSeederFile = (seederType) => {
  switch (seederType) {
    case 'users': return 'userSeeder.js'
    case 'appointments': return 'appointmentSeeder.js'
    case 'extended': return 'extendedSeeder.js'
    case 'all': return 'seedAll.js'
    default: throw new Error('Invalid seeder type')
  }
}

module.exports = { runSeeder }