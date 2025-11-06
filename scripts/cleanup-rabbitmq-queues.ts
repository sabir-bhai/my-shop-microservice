/**
 * Cleanup RabbitMQ Queues
 *
 * This script deletes all existing queues to fix PRECONDITION_FAILED errors
 * Run this when you get queue configuration mismatch errors
 */

import amqp from 'amqplib';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const queuesToDelete = [
  'payment.verified',
  'order.paid',
  'order.created',
  'order.failed',
  'notification.email',
  'notification.sms',
];

async function cleanupQueues() {
  let connection: amqp.Connection | null = null;
  let channel: amqp.Channel | null = null;

  try {
    const rabbitmqUrl = process.env.RABBITMQ_URL;

    if (!rabbitmqUrl) {
      console.error('❌ RABBITMQ_URL not found in environment variables');
      process.exit(1);
    }

    console.log('🔌 Connecting to RabbitMQ...');
    connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();

    console.log('✅ Connected to RabbitMQ\n');
    console.log('🗑️  Deleting queues...\n');

    for (const queueName of queuesToDelete) {
      try {
        await channel.deleteQueue(queueName);
        console.log(`✅ Deleted queue: ${queueName}`);
      } catch (error: any) {
        if (error.message.includes('NOT_FOUND')) {
          console.log(`⚠️  Queue not found (already deleted): ${queueName}`);
        } else {
          console.error(`❌ Failed to delete queue ${queueName}:`, error.message);
        }
      }
    }

    console.log('\n✅ Queue cleanup completed!');
    console.log('📝 Now restart your services to recreate queues with correct settings.');

  } catch (error: any) {
    console.error('❌ Cleanup failed:', error.message);
    process.exit(1);
  } finally {
    try {
      if (channel) await channel.close();
      if (connection) await connection.close();
      console.log('\n🔌 Disconnected from RabbitMQ');
    } catch (error) {
      // Ignore close errors
    }
  }
}

cleanupQueues();
