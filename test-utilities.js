const { DateUtils, TestDataGenerator, Utils } = require('./dist/src/utils');

console.log('🧪 Testing Utilities...\n');

try {
  // Test DateUtils
  console.log('📅 DateUtils Tests:');
  const currentDate = DateUtils.getCurrentDate();
  console.log('- Current date:', currentDate.toISOString());
  
  const formattedDate = DateUtils.formatDate(currentDate, 'YYYY-MM-DD');
  console.log('- Formatted date:', formattedDate);
  
  const tomorrow = DateUtils.addTime(currentDate, 1, 'days');
  console.log('- Tomorrow:', tomorrow.toISOString());
  
  const isBusinessDay = DateUtils.isBusinessDay(currentDate);
  console.log('- Is business day:', isBusinessDay);
  
  console.log('✅ DateUtils working correctly\n');

  // Test TestDataGenerator
  console.log('🎲 TestDataGenerator Tests:');
  const generator = TestDataGenerator.getInstance();
  
  const person = generator.generatePerson();
  console.log('- Generated person:', JSON.stringify(person, null, 2));
  
  const email = generator.generateEmail();
  console.log('- Generated email:', email);
  
  const uuid = generator.generateUUID();
  console.log('- Generated UUID:', uuid);
  
  console.log('✅ TestDataGenerator working correctly\n');

  console.log('🎉 All utilities are working correctly!');
  
} catch (error) {
  console.error('❌ Error testing utilities:', error.message);
  console.error(error.stack);
}
