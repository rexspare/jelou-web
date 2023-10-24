type actionsTypes = 'update_product' | 'see_product' | 'see_img_product' | 'delete_produtc' | 'see_order' | 'cancel_order' | 'delete_category'

export type useEstructureColumnsProps = {
  setData: (rowSelected: object, action: actionsTypes) => void
  setShow: (value: boolean) => void
}