const tepco = require('../services/tepco')

exports.getUsageMessage = async (fromCache = false) => {
  const current = new Date()
  const reportMonth = current.getMonth() + 1
  const reportYear = current.getFullYear()

  if (!fromCache) {
    const report = await tepco.getUsageReport(reportYear, reportMonth)
    await report.save()
  }

  const yesterdayUsage = await tepco.getYesterdayUsage()
  const totalUsageInMonth = await tepco.getTotalUsageInMonth(
    reportYear,
    reportMonth
  )

  return `Yesterday: ${yesterdayUsage} kwh (${tepco
    .calculatePrice(totalUsageInMonth, yesterdayUsage)
    .toFixed(2)} Yen)\nTotal: ${totalUsageInMonth.toFixed(
    2
  )} kwh\nPrice(EST): ${tepco.calculatePrice(totalUsageInMonth).toFixed(2)} Yen`
}
