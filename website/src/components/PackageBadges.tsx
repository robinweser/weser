import Box from '@/components/system/Box'

type Props = {
  package: string
}
export default function PackageBadges({ package: pkg }: Props) {
  const name = encodeURIComponent(pkg)

  return (
    <Box
      direction={['column', 'row']}
      gap={2}
      paddingTop={2}
      paddingBottom={4}
      alignItems={['flex-start', 'center']}>
      <img alt="npm version" src={`https://badge.fury.io/js/${name}.svg`} />
      <img
        alt="npm downloads"
        src={`https://img.shields.io/npm/dm/${name}.svg`}
      />
      <a href={`https://bundlephobia.com/result?p=${name}@latest`}>
        <img
          alt="Bundlephobia"
          src={`https://img.shields.io/bundlephobia/minzip/${name}.svg`}
        />
      </a>
    </Box>
  )
}
