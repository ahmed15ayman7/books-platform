/** Even index = forward, odd index = reverse — alternating autoplay per page order. */
export function carouselAutoplayReverse(pageOrder: number): boolean {
  return pageOrder % 2 === 1;
}
