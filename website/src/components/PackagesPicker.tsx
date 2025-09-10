'use client'
import { useRouter } from 'next/navigation'

import Picker from '@/components/system/Picker'

type Props = {
  activePackage: string
  packages: Array<string>
}

export default function PackagesPicker({ activePackage, packages }: Props) {
  const router = useRouter()

  const options = packages.map((value) => ({
    label: value,
    value,
  }))

  return (
    <Picker
      variant="inline"
      label="Package"
      labelVisible={false}
      value={activePackage}
      options={options}
      renderValue={({ value }) => '@weser/' + value}
      onChange={(e) => {
        router.push(`/${e.target.value}/overview`)
      }}
    />
  )
}
