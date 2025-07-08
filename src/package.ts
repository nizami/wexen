import {$NewType, $Type, Model} from 'rtt';

export function $WebType<T extends Model>(name: string, parent?: $Type, generics?: $Type[]): $Type<T> {
  return $NewType<T>('Web', name, parent, generics);
}
