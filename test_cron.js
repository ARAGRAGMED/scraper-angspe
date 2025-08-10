// Test script for the cron job function
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = promisify(exec);

async function testCron() {
  console.log('🧪 Testing cron job function...');
  
  try {
    // Test if Python scraper exists
    const scraperPath = path.join(__dirname, 'scraper.py');
    if (!fs.existsSync(scraperPath)) {
      console.error('❌ Scraper not found at:', scraperPath);
      return;
    }
    
    console.log('✅ Scraper found at:', scraperPath);
    
    // Test if data directory exists
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      console.log('📁 Creating data directory...');
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    console.log('✅ Data directory ready');
    
    // Test running scraper
    console.log('🚀 Testing scraper execution...');
    const { stdout, stderr } = await execAsync('python3 scraper.py', {
      cwd: __dirname,
      timeout: 30000
    });
    
    console.log('✅ Scraper executed successfully');
    console.log('📊 Output:', stdout);
    
    if (stderr) {
      console.warn('⚠️ Warnings:', stderr);
    }
    
    // Test status file creation
    const statusData = {
      last_cron_run: new Date().toISOString(),
      status: 'success',
      message: 'Test completed successfully'
    };
    
    const statusPath = path.join(dataDir, 'cron_status.json');
    fs.writeFileSync(statusPath, JSON.stringify(statusData, null, 2));
    
    console.log('✅ Status file created at:', statusPath);
    console.log('🎉 All tests passed! Cron job is ready for Vercel.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.stdout) console.log('Output:', error.stdout);
    if (error.stderr) console.log('Error:', error.stderr);
  }
}

testCron();
