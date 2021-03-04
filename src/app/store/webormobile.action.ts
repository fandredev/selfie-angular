import { Action } from '@ngrx/store';


export enum ActionsTypes {
  GET_USER_ACTION = 'GET_USER_ACTION'
}

export class WebOrMobile implements Action {
  readonly type = ActionsTypes.GET_USER_ACTION

  constructor(public isMobile: boolean, public isTablet: typeof isMobile, public isWeb: typeof isMobile) {}
}

export type Actions = WebOrMobile
