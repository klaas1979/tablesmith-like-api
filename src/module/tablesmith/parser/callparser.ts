import { parse } from '../../../../build/parser/peggycall';
import { TableCallValues } from '../tablecallvalues';

class Callparser {
  parse(call: string, options: TableCallValues): void {
    parse(call, options);
  }
}

export const callparser = new Callparser();
