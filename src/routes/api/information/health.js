export const getHealth = () => {
  const health = {
    uptime: process.uptime(),
    responseTime: process.hrtime(),
    message: 'OK',
    timestamp: Date.now()
  }

  return health;
}

export const getHealthDetail = {
  detail: {
    summary: 'Gets the health',
    tags: ['Health']
  }
}
