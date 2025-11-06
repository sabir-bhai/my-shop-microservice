/**
 * Delete RabbitMQ queues via Management API
 * This is needed to resolve PRECONDITION_FAILED errors
 * when queue configurations don't match
 */

const https = require('https');
const url = require('url');

// Parse CloudAMQP URL
const rabbitUrl = 'amqps://odxdyycy:3X5qEUj1J4_hybQm1gDMMn5dVmL1V9cf@campbell.lmq.cloudamqp.com/odxdyycy';
const parsedUrl = new URL(rabbitUrl);

const username = parsedUrl.username;
const password = parsedUrl.password;
const host = parsedUrl.hostname;
const vhost = parsedUrl.pathname.substring(1); // Remove leading /

// Queues to delete
const queuesToDelete = [
  'order.created',
  'payment.verified',
  'payment.failed',
  'order.shipped',
  'order.delivered',
  'user.registered',
];

// Management API URL
const apiHost = host;
const apiPort = 443;

console.log('🗑️  Deleting queues from CloudAMQP...');
console.log(`📡 Host: ${apiHost}`);
console.log(`📂 VHost: ${vhost}`);
console.log('');

// Function to delete a queue
function deleteQueue(queueName) {
  return new Promise((resolve, reject) => {
    const path = `/api/queues/${encodeURIComponent(vhost)}/${encodeURIComponent(queueName)}`;

    const options = {
      hostname: apiHost,
      port: apiPort,
      path: path,
      method: 'DELETE',
      auth: `${username}:${password}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 204 || res.statusCode === 200) {
          console.log(`✅ Deleted queue: ${queueName}`);
          resolve();
        } else if (res.statusCode === 404) {
          console.log(`⚠️  Queue not found: ${queueName} (already deleted or doesn't exist)`);
          resolve();
        } else {
          console.error(`❌ Failed to delete ${queueName}: ${res.statusCode} - ${data}`);
          reject(new Error(`Failed to delete ${queueName}: ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Error deleting ${queueName}:`, error.message);
      reject(error);
    });

    req.end();
  });
}

// Delete all queues sequentially
async function deleteAllQueues() {
  console.log(`🚀 Starting to delete ${queuesToDelete.length} queues...`);
  console.log('');

  for (const queue of queuesToDelete) {
    try {
      await deleteQueue(queue);
      // Small delay between deletions
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to delete queue ${queue}:`, error.message);
    }
  }

  console.log('');
  console.log('✅ Queue deletion complete!');
  console.log('🔄 Now restart your services to recreate the queues with correct configuration.');
}

// Run the deletion
deleteAllQueues().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
