export const capitalizeStr = (str: string) => {
  return str[0].toUpperCase() + str.slice(1)
}

export const normailizeName = (name: string) => {
  const parts = name.split('-')
  return parts.map((str) => capitalizeStr(str)).join(' ')
}
