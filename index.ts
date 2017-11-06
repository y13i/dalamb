import {
  Context,
  Callback,
  Handler,
} from "aws-lambda";

export default function dalamb<Event = any, Returned = any>(fn: (event: Event, context: Context, callback: Callback) => Returned | Promise<Returned>): Handler {
  return (event: Event, context: Context, callback: Callback) => {
    try {
      const returned = fn(event, context, callback);

      if (returned && returned instanceof Promise) {
        returned.then(result => {
          handleResult(result, callback);
        }).catch(error => {
          handleError(error, callback);
        });
      } else {
        handleResult(returned, callback);
      }
    } catch (error) {
      handleError(error, callback);
    }
  };
}

function handleResult(result: any, callback: Callback) {
  callback(null, result);
}

function handleError(error: any, callback: Callback) {
  console.error(error);
  callback(error);
}

module.exports = dalamb;
