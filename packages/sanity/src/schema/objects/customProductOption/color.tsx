import pluralize from 'pluralize-esm'
import {defineField} from 'sanity'

interface ColorOption {
  title: string
}

const ColorPreview = ({color}: {color: string}) => {
  return (
    <div
      style={{
        backgroundColor: color,
        borderRadius: 'inherit',
        display: 'flex',
        height: '100%',
        width: '100%',
      }}
    />
  )
}

export default defineField({
  name: 'customProductOption.color',
  title: 'Color',
  type: 'object',
  icon: false,
  fields: [
    // Title
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Shopify product option name (case sensitive)',
      validation: (rule) => rule.required(),
    }),
    // Colors
    defineField({
      name: 'colors',
      title: 'Colors',
      type: 'array',
      of: [
        {
          name: 'customProductOption.colorObject',
          title: 'Color',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'Shopify product option value (case sensitive)',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'color',
              title: 'Color',
              type: 'color',
              options: {disableAlpha: true},
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              color: 'color.hex',
              title: 'title',
            },
            prepare(selection) {
              const {color, title} = selection
              return {
                media: <ColorPreview color={color} />,
                subtitle: color,
                title,
              }
            },
          },
        },
      ],
      validation: (rule) =>
        rule.custom((options: ColorOption[] | undefined) => {
          // Each size must have a unique title
          if (options) {
            const uniqueTitles = new Set(options.map((option) => option?.title))
            if (options.length > uniqueTitles.size) {
              return 'Each product option must have a unique title'
            }
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {
      colors: 'colors',
      title: 'title',
    },
    prepare(selection) {
      const {colors, title} = selection
      return {
        subtitle: colors?.length > 0 ? pluralize('color', colors.length, true) : 'No colors',
        title,
      }
    },
  },
})
