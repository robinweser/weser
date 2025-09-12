import useForm from './useForm'

import { z } from 'zod'

const Z_Test = z.object({
  name: z.string(),
  email: z.string().email(),
  items: z.array(
    z.object({
      title: z.string(),
    })
  ),
})

export default function Test() {
  const { useFormField, useFieldArray } = useForm(Z_Test)

  const name = useFormField('name')
  const email = useFormField('email')

  const [items, { append, remove }] = useFieldArray('items', [
    {
      title: 'asd',
    },
  ])

  const i = items.map(({ id }) => {
    const title = useFormField<Array<string>>(`items.${id}.title`, {
      value: [],
    })

    return <div key={id}></div>
  })
}
