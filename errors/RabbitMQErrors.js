module.exports = {
    'QueueNotReady': {
        'message': 'Messaging Queue Is Not Ready',
        'customCode': 'MESSAGING_QUEUE_IS_NOT_READY',
        'statusCode': 503
    },
    'QueueNotFound': {
        'message': 'Messaging Queue Not Found',
        'customCode': 'MESSAGING_QUEUE_NOT_FOUND',
        'statusCode': 404
    },
    'QueuePublishError': {
        'message': 'Not able to publish to Messaging Queue',
        'customCode': 'QUEUE_PUBLISH_ERROR',
        'statusCode': 500
    },
    'InvalidConsumer': {
        'message': 'Invalid consumer',
        'customCode': 'INVALID_CONSUMER_IN_JOBHANDLER',
        'statusCode': 400
    },
    'InvalidConfig': {
        'message': 'Invalid configuration',
        'customCode': 'INVALID_CONFIG',
        'statusCode': 400
    }
};