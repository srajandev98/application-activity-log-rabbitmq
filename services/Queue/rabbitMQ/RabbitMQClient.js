const ConnectionManager = require('amqp-connection-manager');
const RabbitMQConfig = require('../../../config').getConfig().rabbitmq;
class RabbitMQClient {

    constructor() {
        this.connectionManager = ConnectionManager;
        this.config = RabbitMQConfig;
        this.initialized = false;
    }

    setup() {
        return Promise.reject(Errors.Unimplemented());
    }
}