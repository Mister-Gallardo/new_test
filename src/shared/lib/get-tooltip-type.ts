type TooltipResult<T extends boolean = false, D extends boolean = false> =
  | 'auth'
  | 'subscription'
  | (T extends true ? 'tester' : undefined)
  | (D extends true ? 'default' : undefined)

export const getTooltipType = <T extends boolean = false, D extends boolean = false>(
  value: string | number | undefined,
  isAuth: boolean,
  isUserTester?: T,
  withDefault?: D,
): TooltipResult<T, D> => {
  if (!value) return undefined as TooltipResult<T, D>

  const isHidden = typeof value === 'number' ? value === -1 : value.includes('░')

  if (isHidden) {
    if (!isAuth) return 'auth' as TooltipResult<T, D>
    if (isUserTester) return 'tester' as TooltipResult<T, D>
    return 'subscription' as TooltipResult<T, D>
  }

  return (withDefault ? 'default' : undefined) as TooltipResult<T, D>
}
