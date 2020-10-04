import * as _ from 'lodash'


export interface IState {
  enter? : () => void,
  exit? : () => void,
  update?: (deltaTime: number) => void
}

interface IFSMState<T> extends IState {
  fsm : FSM<T>,
}

export class FSM<T> {
  private _state : T;
  private stateObjects = new Map<T, IFSMState<T>>();

  public registerState = (key : T, stateObject : IState) => {
    this.stateObjects.set(key, _.defaults({
      fsm : this,
    }, stateObject));
  }

  public update = (deltaTime: number) => {
    if (this.stateObjects.get(this._state) && this.stateObjects.get(this._state).update)
    {
      this.stateObjects.get(this._state).update(deltaTime);
    }
  }

  public setState = (val : T) => {
    if (this.stateObjects.get(this._state) && this.stateObjects.get(this._state).exit) {
      this.stateObjects.get(this._state).exit();
    }
    this._state = val;
    if (this.stateObjects.get(this._state).enter)
    {
      this.stateObjects.get(this._state).enter();
    }
  }

  get state(): T {
    return this._state;
  }
}