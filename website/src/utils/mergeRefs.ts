export default function mergeRefs(...refs: Array<any>) {
  return (el: any) => {
    refs.forEach((ref) => {
      if (!ref) {
        return
      }

      if (typeof ref === 'function') {
        ref(el)
      } else {
        ref.current = el
      }
    })
  }
}
