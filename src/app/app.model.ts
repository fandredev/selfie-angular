export type Colors = 'primary' | 'secondary'


interface FaceAttr {
  age: number
  gender: string
}

interface FaceRect {
  height: number
  left: number
  top: number
  width: number
}

export interface DataLoad {
  faceAttributes: FaceAttr
  faceId: string
  faceRectangule: FaceRect
}

export interface I_WebOrMobile<T = boolean> {
  isMobile: T
  isTablet: T
  isWeb: T
}
