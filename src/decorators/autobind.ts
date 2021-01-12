namespace App {
  // @decorator
  export function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    // save original method which is passed to the decorator
    const originalMethod = descriptor.value;

    // modify PropertyDescriptor
    const adjDescriptor: PropertyDescriptor = {
      configurable: true,
      // set getter which returns original method with binded this keyword
      get() {
        const boundFn = originalMethod.bind(this);
        return boundFn;
      },
    };

    // return modified PropertyDescriptor
    return adjDescriptor;
  }
}
