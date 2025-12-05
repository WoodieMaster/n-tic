import winston  from "winston";
const { combine, timestamp, cli } = winston.format;

const logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    level: process.env.LOG_LEVEL || "info",
    format: combine(timestamp(), cli()),
    transports: [new winston.transports.Console()]
})

export default logger;