import { StructureBuilder } from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Ruqma Content')
    .items([
      S.listItem()
        .title('Products')
        .icon(() => '🛍️')
        .child(
          S.documentTypeList('product')
            .title('All Products')
            .filter('_type == "product"')
            .defaultOrdering([{ field: 'name', direction: 'asc' }])
        ),
      S.divider(),
      S.listItem()
        .title('Testimonials')
        .icon(() => '💬')
        .child(
          S.documentTypeList('testimonial')
            .title('All Testimonials')
            .filter('_type == "testimonial"')
            .defaultOrdering([{ field: 'priority', direction: 'asc' }])
        ),
      S.divider(),
      S.listItem()
        .title('Partners')
        .icon(() => '🤝')
        .child(
          S.documentTypeList('partner')
            .title('All Partners')
            .filter('_type == "partner"')
            .defaultOrdering([{ field: 'displayOrder', direction: 'asc' }])
        ),
    ])
