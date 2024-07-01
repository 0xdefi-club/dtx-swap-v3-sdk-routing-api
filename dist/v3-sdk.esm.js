import { ChainId, MaxUint256, sqrt, Price, CurrencyAmount, Percent, TradeType, Fraction, sortedInsert, validateAndParseAddress } from '@uniswap/sdk-core';
import JSBI from 'jsbi';
import invariant from 'tiny-invariant';
import { defaultAbiCoder, Interface } from '@ethersproject/abi';
import { getCreate2Address } from '@ethersproject/address';
import { keccak256, pack } from '@ethersproject/solidity';
import IMulticall from '@uniswap/v3-periphery/artifacts/contracts/interfaces/IMulticall.sol/IMulticall.json';
import INonfungiblePositionManager from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json';
import ISelfPermit from '@uniswap/v3-periphery/artifacts/contracts/interfaces/ISelfPermit.sol/ISelfPermit.json';
import IPeripheryPaymentsWithFee from '@uniswap/v3-periphery/artifacts/contracts/interfaces/IPeripheryPaymentsWithFee.sol/IPeripheryPaymentsWithFee.json';
import IQuoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';
import IQuoterV2 from '@uniswap/swap-router-contracts/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json';
import IUniswapV3Staker from '@uniswap/v3-staker/artifacts/contracts/UniswapV3Staker.sol/UniswapV3Staker.json';
import ISwapRouter from '@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  it = o[Symbol.iterator]();
  return it.next.bind(it);
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime_1 = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; };
  var undefined$1; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) });

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: true });
  defineProperty(
    GeneratorFunctionPrototype,
    "constructor",
    { value: GeneratorFunction, configurable: true }
  );
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    defineProperty(this, "_invoke", { value: enqueue });
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per GeneratorResume behavior specified since ES2015:
        // ES2015 spec, step 3: https://262.ecma-international.org/6.0/#sec-generatorresume
        // Latest spec, step 2: https://tc39.es/ecma262/#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method;
    var method = delegate.iterator[methodName];
    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method, or a missing .next method, always terminate the
      // yield* loop.
      context.delegate = null;

      // Note: ["return"] must be used for ES3 parsing compatibility.
      if (methodName === "throw" && delegate.iterator["return"]) {
        // If the delegate iterator has a return method, give it a
        // chance to clean up.
        context.method = "return";
        context.arg = undefined$1;
        maybeInvokeDelegate(delegate, context);

        if (context.method === "throw") {
          // If maybeInvokeDelegate(context) changed context.method from
          // "return" to "throw", let that override the TypeError below.
          return ContinueSentinel;
        }
      }
      if (methodName !== "return") {
        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a '" + methodName + "' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(val) {
    var object = Object(val);
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable != null) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined$1;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    throw new TypeError(typeof iterable + " is not iterable");
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined$1, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined$1;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined$1;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined$1;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   module.exports 
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}
});

var _FACTORY_ADDRESS_MAP, _TICK_SPACINGS;

var FACTORY_ADDRESS = '0xfCA1AEf282A99390B62Ca8416a68F5747716260c'; // Taiko

var FACTORY_ADDRESS_MAP = (_FACTORY_ADDRESS_MAP = {}, _FACTORY_ADDRESS_MAP[ChainId.BASE_SEPOLIA] = '0xfaa89f95CE1948582154ee1C0Ea47701cBb95E04', _FACTORY_ADDRESS_MAP[ChainId.TAIKO] = '0xfCA1AEf282A99390B62Ca8416a68F5747716260c', _FACTORY_ADDRESS_MAP);
var ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';
var POOL_INIT_CODE_HASH = '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54';
/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */

var FeeAmount;

(function (FeeAmount) {
  FeeAmount[FeeAmount["LOWEST"] = 100] = "LOWEST";
  FeeAmount[FeeAmount["LOW"] = 500] = "LOW";
  FeeAmount[FeeAmount["MEDIUM"] = 3000] = "MEDIUM";
  FeeAmount[FeeAmount["HIGH"] = 10000] = "HIGH";
})(FeeAmount || (FeeAmount = {}));
/**
 * The default factory tick spacings by fee amount.
 */


var TICK_SPACINGS = (_TICK_SPACINGS = {}, _TICK_SPACINGS[FeeAmount.LOWEST] = 1, _TICK_SPACINGS[FeeAmount.LOW] = 10, _TICK_SPACINGS[FeeAmount.MEDIUM] = 60, _TICK_SPACINGS[FeeAmount.HIGH] = 200, _TICK_SPACINGS);

var NEGATIVE_ONE = /*#__PURE__*/JSBI.BigInt(-1);
var ZERO = /*#__PURE__*/JSBI.BigInt(0);
var ONE = /*#__PURE__*/JSBI.BigInt(1); // used in liquidity amount math

var Q96 = /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(2), /*#__PURE__*/JSBI.BigInt(96));
var Q192 = /*#__PURE__*/JSBI.exponentiate(Q96, /*#__PURE__*/JSBI.BigInt(2));

/**
 * Computes a pool address
 * @param factoryAddress The Uniswap V3 factory address
 * @param tokenA The first token of the pair, irrespective of sort order
 * @param tokenB The second token of the pair, irrespective of sort order
 * @param fee The fee tier of the pool
 * @param initCodeHashManualOverride Override the init code hash used to compute the pool address if necessary
 * @returns The pool address
 */

function computePoolAddress(_ref) {
  var factoryAddress = _ref.factoryAddress,
      tokenA = _ref.tokenA,
      tokenB = _ref.tokenB,
      fee = _ref.fee,
      initCodeHashManualOverride = _ref.initCodeHashManualOverride;

  var _ref2 = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA],
      token0 = _ref2[0],
      token1 = _ref2[1]; // does safety checks


  return getCreate2Address(factoryAddress, keccak256(['bytes'], [defaultAbiCoder.encode(['address', 'address', 'uint24'], [token0.address, token1.address, fee])]), initCodeHashManualOverride != null ? initCodeHashManualOverride : POOL_INIT_CODE_HASH);
}

var LiquidityMath = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function LiquidityMath() {}

  LiquidityMath.addDelta = function addDelta(x, y) {
    if (JSBI.lessThan(y, ZERO)) {
      return JSBI.subtract(x, JSBI.multiply(y, NEGATIVE_ONE));
    } else {
      return JSBI.add(x, y);
    }
  };

  return LiquidityMath;
}();

var FullMath = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function FullMath() {}

  FullMath.mulDivRoundingUp = function mulDivRoundingUp(a, b, denominator) {
    var product = JSBI.multiply(a, b);
    var result = JSBI.divide(product, denominator);
    if (JSBI.notEqual(JSBI.remainder(product, denominator), ZERO)) result = JSBI.add(result, ONE);
    return result;
  };

  return FullMath;
}();

var MaxUint160 = /*#__PURE__*/JSBI.subtract( /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(2), /*#__PURE__*/JSBI.BigInt(160)), ONE);

function multiplyIn256(x, y) {
  var product = JSBI.multiply(x, y);
  return JSBI.bitwiseAnd(product, MaxUint256);
}

function addIn256(x, y) {
  var sum = JSBI.add(x, y);
  return JSBI.bitwiseAnd(sum, MaxUint256);
}

var SqrtPriceMath = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function SqrtPriceMath() {}

  SqrtPriceMath.getAmount0Delta = function getAmount0Delta(sqrtRatioAX96, sqrtRatioBX96, liquidity, roundUp) {
    if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
      var _ref = [sqrtRatioBX96, sqrtRatioAX96];
      sqrtRatioAX96 = _ref[0];
      sqrtRatioBX96 = _ref[1];
    }

    var numerator1 = JSBI.leftShift(liquidity, JSBI.BigInt(96));
    var numerator2 = JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96);
    return roundUp ? FullMath.mulDivRoundingUp(FullMath.mulDivRoundingUp(numerator1, numerator2, sqrtRatioBX96), ONE, sqrtRatioAX96) : JSBI.divide(JSBI.divide(JSBI.multiply(numerator1, numerator2), sqrtRatioBX96), sqrtRatioAX96);
  };

  SqrtPriceMath.getAmount1Delta = function getAmount1Delta(sqrtRatioAX96, sqrtRatioBX96, liquidity, roundUp) {
    if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
      var _ref2 = [sqrtRatioBX96, sqrtRatioAX96];
      sqrtRatioAX96 = _ref2[0];
      sqrtRatioBX96 = _ref2[1];
    }

    return roundUp ? FullMath.mulDivRoundingUp(liquidity, JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96), Q96) : JSBI.divide(JSBI.multiply(liquidity, JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96)), Q96);
  };

  SqrtPriceMath.getNextSqrtPriceFromInput = function getNextSqrtPriceFromInput(sqrtPX96, liquidity, amountIn, zeroForOne) {
    !JSBI.greaterThan(sqrtPX96, ZERO) ? process.env.NODE_ENV !== "production" ? invariant(false) : invariant(false) : void 0;
    !JSBI.greaterThan(liquidity, ZERO) ? process.env.NODE_ENV !== "production" ? invariant(false) : invariant(false) : void 0;
    return zeroForOne ? this.getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amountIn, true) : this.getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amountIn, true);
  };

  SqrtPriceMath.getNextSqrtPriceFromOutput = function getNextSqrtPriceFromOutput(sqrtPX96, liquidity, amountOut, zeroForOne) {
    !JSBI.greaterThan(sqrtPX96, ZERO) ? process.env.NODE_ENV !== "production" ? invariant(false) : invariant(false) : void 0;
    !JSBI.greaterThan(liquidity, ZERO) ? process.env.NODE_ENV !== "production" ? invariant(false) : invariant(false) : void 0;
    return zeroForOne ? this.getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amountOut, false) : this.getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amountOut, false);
  };

  SqrtPriceMath.getNextSqrtPriceFromAmount0RoundingUp = function getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amount, add) {
    if (JSBI.equal(amount, ZERO)) return sqrtPX96;
    var numerator1 = JSBI.leftShift(liquidity, JSBI.BigInt(96));

    if (add) {
      var product = multiplyIn256(amount, sqrtPX96);

      if (JSBI.equal(JSBI.divide(product, amount), sqrtPX96)) {
        var denominator = addIn256(numerator1, product);

        if (JSBI.greaterThanOrEqual(denominator, numerator1)) {
          return FullMath.mulDivRoundingUp(numerator1, sqrtPX96, denominator);
        }
      }

      return FullMath.mulDivRoundingUp(numerator1, ONE, JSBI.add(JSBI.divide(numerator1, sqrtPX96), amount));
    } else {
      var _product = multiplyIn256(amount, sqrtPX96);

      !JSBI.equal(JSBI.divide(_product, amount), sqrtPX96) ? process.env.NODE_ENV !== "production" ? invariant(false) : invariant(false) : void 0;
      !JSBI.greaterThan(numerator1, _product) ? process.env.NODE_ENV !== "production" ? invariant(false) : invariant(false) : void 0;

      var _denominator = JSBI.subtract(numerator1, _product);

      return FullMath.mulDivRoundingUp(numerator1, sqrtPX96, _denominator);
    }
  };

  SqrtPriceMath.getNextSqrtPriceFromAmount1RoundingDown = function getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amount, add) {
    if (add) {
      var quotient = JSBI.lessThanOrEqual(amount, MaxUint160) ? JSBI.divide(JSBI.leftShift(amount, JSBI.BigInt(96)), liquidity) : JSBI.divide(JSBI.multiply(amount, Q96), liquidity);
      return JSBI.add(sqrtPX96, quotient);
    } else {
      var _quotient = FullMath.mulDivRoundingUp(amount, Q96, liquidity);

      !JSBI.greaterThan(sqrtPX96, _quotient) ? process.env.NODE_ENV !== "production" ? invariant(false) : invariant(false) : void 0;
      return JSBI.subtract(sqrtPX96, _quotient);
    }
  };

  return SqrtPriceMath;
}();

var MAX_FEE = /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(10), /*#__PURE__*/JSBI.BigInt(6));
var SwapMath = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function SwapMath() {}

  SwapMath.computeSwapStep = function computeSwapStep(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, amountRemaining, feePips) {
    var returnValues = {};
    var zeroForOne = JSBI.greaterThanOrEqual(sqrtRatioCurrentX96, sqrtRatioTargetX96);
    var exactIn = JSBI.greaterThanOrEqual(amountRemaining, ZERO);

    if (exactIn) {
      var amountRemainingLessFee = JSBI.divide(JSBI.multiply(amountRemaining, JSBI.subtract(MAX_FEE, JSBI.BigInt(feePips))), MAX_FEE);
      returnValues.amountIn = zeroForOne ? SqrtPriceMath.getAmount0Delta(sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity, true) : SqrtPriceMath.getAmount1Delta(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, true);

      if (JSBI.greaterThanOrEqual(amountRemainingLessFee, returnValues.amountIn)) {
        returnValues.sqrtRatioNextX96 = sqrtRatioTargetX96;
      } else {
        returnValues.sqrtRatioNextX96 = SqrtPriceMath.getNextSqrtPriceFromInput(sqrtRatioCurrentX96, liquidity, amountRemainingLessFee, zeroForOne);
      }
    } else {
      returnValues.amountOut = zeroForOne ? SqrtPriceMath.getAmount1Delta(sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity, false) : SqrtPriceMath.getAmount0Delta(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, false);

      if (JSBI.greaterThanOrEqual(JSBI.multiply(amountRemaining, NEGATIVE_ONE), returnValues.amountOut)) {
        returnValues.sqrtRatioNextX96 = sqrtRatioTargetX96;
      } else {
        returnValues.sqrtRatioNextX96 = SqrtPriceMath.getNextSqrtPriceFromOutput(sqrtRatioCurrentX96, liquidity, JSBI.multiply(amountRemaining, NEGATIVE_ONE), zeroForOne);
      }
    }

    var max = JSBI.equal(sqrtRatioTargetX96, returnValues.sqrtRatioNextX96);

    if (zeroForOne) {
      returnValues.amountIn = max && exactIn ? returnValues.amountIn : SqrtPriceMath.getAmount0Delta(returnValues.sqrtRatioNextX96, sqrtRatioCurrentX96, liquidity, true);
      returnValues.amountOut = max && !exactIn ? returnValues.amountOut : SqrtPriceMath.getAmount1Delta(returnValues.sqrtRatioNextX96, sqrtRatioCurrentX96, liquidity, false);
    } else {
      returnValues.amountIn = max && exactIn ? returnValues.amountIn : SqrtPriceMath.getAmount1Delta(sqrtRatioCurrentX96, returnValues.sqrtRatioNextX96, liquidity, true);
      returnValues.amountOut = max && !exactIn ? returnValues.amountOut : SqrtPriceMath.getAmount0Delta(sqrtRatioCurrentX96, returnValues.sqrtRatioNextX96, liquidity, false);
    }

    if (!exactIn && JSBI.greaterThan(returnValues.amountOut, JSBI.multiply(amountRemaining, NEGATIVE_ONE))) {
      returnValues.amountOut = JSBI.multiply(amountRemaining, NEGATIVE_ONE);
    }

    if (exactIn && JSBI.notEqual(returnValues.sqrtRatioNextX96, sqrtRatioTargetX96)) {
      // we didn't reach the target, so take the remainder of the maximum input as fee
      returnValues.feeAmount = JSBI.subtract(amountRemaining, returnValues.amountIn);
    } else {
      returnValues.feeAmount = FullMath.mulDivRoundingUp(returnValues.amountIn, JSBI.BigInt(feePips), JSBI.subtract(MAX_FEE, JSBI.BigInt(feePips)));
    }

    return [returnValues.sqrtRatioNextX96, returnValues.amountIn, returnValues.amountOut, returnValues.feeAmount];
  };

  return SwapMath;
}();

var TWO = /*#__PURE__*/JSBI.BigInt(2);
var POWERS_OF_2 = /*#__PURE__*/[128, 64, 32, 16, 8, 4, 2, 1].map(function (pow) {
  return [pow, JSBI.exponentiate(TWO, JSBI.BigInt(pow))];
});
function mostSignificantBit(x) {
  !JSBI.greaterThan(x, ZERO) ? process.env.NODE_ENV !== "production" ? invariant(false, 'ZERO') : invariant(false) : void 0;
  !JSBI.lessThanOrEqual(x, MaxUint256) ? process.env.NODE_ENV !== "production" ? invariant(false, 'MAX') : invariant(false) : void 0;
  var msb = 0;

  for (var _iterator = _createForOfIteratorHelperLoose(POWERS_OF_2), _step; !(_step = _iterator()).done;) {
    var _step$value = _step.value,
        power = _step$value[0],
        min = _step$value[1];

    if (JSBI.greaterThanOrEqual(x, min)) {
      x = JSBI.signedRightShift(x, JSBI.BigInt(power));
      msb += power;
    }
  }

  return msb;
}

function mulShift(val, mulBy) {
  return JSBI.signedRightShift(JSBI.multiply(val, JSBI.BigInt(mulBy)), JSBI.BigInt(128));
}

var Q32 = /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(2), /*#__PURE__*/JSBI.BigInt(32));
var TickMath = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function TickMath() {}
  /**
   * Returns the sqrt ratio as a Q64.96 for the given tick. The sqrt ratio is computed as sqrt(1.0001)^tick
   * @param tick the tick for which to compute the sqrt ratio
   */


  TickMath.getSqrtRatioAtTick = function getSqrtRatioAtTick(tick) {
    !(tick >= TickMath.MIN_TICK && tick <= TickMath.MAX_TICK && Number.isInteger(tick)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TICK') : invariant(false) : void 0;
    var absTick = tick < 0 ? tick * -1 : tick;
    var ratio = (absTick & 0x1) != 0 ? JSBI.BigInt('0xfffcb933bd6fad37aa2d162d1a594001') : JSBI.BigInt('0x100000000000000000000000000000000');
    if ((absTick & 0x2) != 0) ratio = mulShift(ratio, '0xfff97272373d413259a46990580e213a');
    if ((absTick & 0x4) != 0) ratio = mulShift(ratio, '0xfff2e50f5f656932ef12357cf3c7fdcc');
    if ((absTick & 0x8) != 0) ratio = mulShift(ratio, '0xffe5caca7e10e4e61c3624eaa0941cd0');
    if ((absTick & 0x10) != 0) ratio = mulShift(ratio, '0xffcb9843d60f6159c9db58835c926644');
    if ((absTick & 0x20) != 0) ratio = mulShift(ratio, '0xff973b41fa98c081472e6896dfb254c0');
    if ((absTick & 0x40) != 0) ratio = mulShift(ratio, '0xff2ea16466c96a3843ec78b326b52861');
    if ((absTick & 0x80) != 0) ratio = mulShift(ratio, '0xfe5dee046a99a2a811c461f1969c3053');
    if ((absTick & 0x100) != 0) ratio = mulShift(ratio, '0xfcbe86c7900a88aedcffc83b479aa3a4');
    if ((absTick & 0x200) != 0) ratio = mulShift(ratio, '0xf987a7253ac413176f2b074cf7815e54');
    if ((absTick & 0x400) != 0) ratio = mulShift(ratio, '0xf3392b0822b70005940c7a398e4b70f3');
    if ((absTick & 0x800) != 0) ratio = mulShift(ratio, '0xe7159475a2c29b7443b29c7fa6e889d9');
    if ((absTick & 0x1000) != 0) ratio = mulShift(ratio, '0xd097f3bdfd2022b8845ad8f792aa5825');
    if ((absTick & 0x2000) != 0) ratio = mulShift(ratio, '0xa9f746462d870fdf8a65dc1f90e061e5');
    if ((absTick & 0x4000) != 0) ratio = mulShift(ratio, '0x70d869a156d2a1b890bb3df62baf32f7');
    if ((absTick & 0x8000) != 0) ratio = mulShift(ratio, '0x31be135f97d08fd981231505542fcfa6');
    if ((absTick & 0x10000) != 0) ratio = mulShift(ratio, '0x9aa508b5b7a84e1c677de54f3e99bc9');
    if ((absTick & 0x20000) != 0) ratio = mulShift(ratio, '0x5d6af8dedb81196699c329225ee604');
    if ((absTick & 0x40000) != 0) ratio = mulShift(ratio, '0x2216e584f5fa1ea926041bedfe98');
    if ((absTick & 0x80000) != 0) ratio = mulShift(ratio, '0x48a170391f7dc42444e8fa2');
    if (tick > 0) ratio = JSBI.divide(MaxUint256, ratio); // back to Q96

    return JSBI.greaterThan(JSBI.remainder(ratio, Q32), ZERO) ? JSBI.add(JSBI.divide(ratio, Q32), ONE) : JSBI.divide(ratio, Q32);
  }
  /**
   * Returns the tick corresponding to a given sqrt ratio, s.t. #getSqrtRatioAtTick(tick) <= sqrtRatioX96
   * and #getSqrtRatioAtTick(tick + 1) > sqrtRatioX96
   * @param sqrtRatioX96 the sqrt ratio as a Q64.96 for which to compute the tick
   */
  ;

  TickMath.getTickAtSqrtRatio = function getTickAtSqrtRatio(sqrtRatioX96) {
    !(JSBI.greaterThanOrEqual(sqrtRatioX96, TickMath.MIN_SQRT_RATIO) && JSBI.lessThan(sqrtRatioX96, TickMath.MAX_SQRT_RATIO)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'SQRT_RATIO') : invariant(false) : void 0;
    var sqrtRatioX128 = JSBI.leftShift(sqrtRatioX96, JSBI.BigInt(32));
    var msb = mostSignificantBit(sqrtRatioX128);
    var r;

    if (JSBI.greaterThanOrEqual(JSBI.BigInt(msb), JSBI.BigInt(128))) {
      r = JSBI.signedRightShift(sqrtRatioX128, JSBI.BigInt(msb - 127));
    } else {
      r = JSBI.leftShift(sqrtRatioX128, JSBI.BigInt(127 - msb));
    }

    var log_2 = JSBI.leftShift(JSBI.subtract(JSBI.BigInt(msb), JSBI.BigInt(128)), JSBI.BigInt(64));

    for (var i = 0; i < 14; i++) {
      r = JSBI.signedRightShift(JSBI.multiply(r, r), JSBI.BigInt(127));
      var f = JSBI.signedRightShift(r, JSBI.BigInt(128));
      log_2 = JSBI.bitwiseOr(log_2, JSBI.leftShift(f, JSBI.BigInt(63 - i)));
      r = JSBI.signedRightShift(r, f);
    }

    var log_sqrt10001 = JSBI.multiply(log_2, JSBI.BigInt('255738958999603826347141'));
    var tickLow = JSBI.toNumber(JSBI.signedRightShift(JSBI.subtract(log_sqrt10001, JSBI.BigInt('3402992956809132418596140100660247210')), JSBI.BigInt(128)));
    var tickHigh = JSBI.toNumber(JSBI.signedRightShift(JSBI.add(log_sqrt10001, JSBI.BigInt('291339464771989622907027621153398088495')), JSBI.BigInt(128)));
    return tickLow === tickHigh ? tickLow : JSBI.lessThanOrEqual(TickMath.getSqrtRatioAtTick(tickHigh), sqrtRatioX96) ? tickHigh : tickLow;
  };

  return TickMath;
}();
/**
 * The minimum tick that can be used on any pool.
 */

TickMath.MIN_TICK = -887272;
/**
 * The maximum tick that can be used on any pool.
 */

TickMath.MAX_TICK = -TickMath.MIN_TICK;
/**
 * The sqrt ratio corresponding to the minimum tick that could be used on any pool.
 */

TickMath.MIN_SQRT_RATIO = /*#__PURE__*/JSBI.BigInt('4295128739');
/**
 * The sqrt ratio corresponding to the maximum tick that could be used on any pool.
 */

TickMath.MAX_SQRT_RATIO = /*#__PURE__*/JSBI.BigInt('1461446703485210103287273052203988822378723970342');

/**
 * This tick data provider does not know how to fetch any tick data. It throws whenever it is required. Useful if you
 * do not need to load tick data for your use case.
 */
var NoTickDataProvider = /*#__PURE__*/function () {
  function NoTickDataProvider() {}

  var _proto = NoTickDataProvider.prototype;

  _proto.getTick = /*#__PURE__*/function () {
    var _getTick = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(_tick) {
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              throw new Error(NoTickDataProvider.ERROR_MESSAGE);

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function getTick(_x) {
      return _getTick.apply(this, arguments);
    }

    return getTick;
  }();

  _proto.nextInitializedTickWithinOneWord = /*#__PURE__*/function () {
    var _nextInitializedTickWithinOneWord = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(_tick, _lte, _tickSpacing) {
      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              throw new Error(NoTickDataProvider.ERROR_MESSAGE);

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    function nextInitializedTickWithinOneWord(_x2, _x3, _x4) {
      return _nextInitializedTickWithinOneWord.apply(this, arguments);
    }

    return nextInitializedTickWithinOneWord;
  }();

  return NoTickDataProvider;
}();
NoTickDataProvider.ERROR_MESSAGE = 'No tick data provider was given';

/**
 * Determines if a tick list is sorted
 * @param list The tick list
 * @param comparator The comparator
 * @returns true if sorted
 */
function isSorted(list, comparator) {
  for (var i = 0; i < list.length - 1; i++) {
    if (comparator(list[i], list[i + 1]) > 0) {
      return false;
    }
  }

  return true;
}

function tickComparator(a, b) {
  return a.index - b.index;
}
/**
 * Utility methods for interacting with sorted lists of ticks
 */


var TickList = /*#__PURE__*/function () {
  /**
   * Cannot be constructed
   */
  function TickList() {}

  TickList.validateList = function validateList(ticks, tickSpacing) {
    !(tickSpacing > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TICK_SPACING_NONZERO') : invariant(false) : void 0; // ensure ticks are spaced appropriately

    !ticks.every(function (_ref) {
      var index = _ref.index;
      return index % tickSpacing === 0;
    }) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TICK_SPACING') : invariant(false) : void 0; // ensure tick liquidity deltas sum to 0

    !JSBI.equal(ticks.reduce(function (accumulator, _ref2) {
      var liquidityNet = _ref2.liquidityNet;
      return JSBI.add(accumulator, liquidityNet);
    }, ZERO), ZERO) ? process.env.NODE_ENV !== "production" ? invariant(false, 'ZERO_NET') : invariant(false) : void 0;
    !isSorted(ticks, tickComparator) ? process.env.NODE_ENV !== "production" ? invariant(false, 'SORTED') : invariant(false) : void 0;
  };

  TickList.isBelowSmallest = function isBelowSmallest(ticks, tick) {
    !(ticks.length > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'LENGTH') : invariant(false) : void 0;
    return tick < ticks[0].index;
  };

  TickList.isAtOrAboveLargest = function isAtOrAboveLargest(ticks, tick) {
    !(ticks.length > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'LENGTH') : invariant(false) : void 0;
    return tick >= ticks[ticks.length - 1].index;
  };

  TickList.getTick = function getTick(ticks, index) {
    var tick = ticks[this.binarySearch(ticks, index)];
    !(tick.index === index) ? process.env.NODE_ENV !== "production" ? invariant(false, 'NOT_CONTAINED') : invariant(false) : void 0;
    return tick;
  }
  /**
   * Finds the largest tick in the list of ticks that is less than or equal to tick
   * @param ticks list of ticks
   * @param tick tick to find the largest tick that is less than or equal to tick
   * @private
   */
  ;

  TickList.binarySearch = function binarySearch(ticks, tick) {
    !!this.isBelowSmallest(ticks, tick) ? process.env.NODE_ENV !== "production" ? invariant(false, 'BELOW_SMALLEST') : invariant(false) : void 0;
    var l = 0;
    var r = ticks.length - 1;
    var i;

    while (true) {
      i = Math.floor((l + r) / 2);

      if (ticks[i].index <= tick && (i === ticks.length - 1 || ticks[i + 1].index > tick)) {
        return i;
      }

      if (ticks[i].index < tick) {
        l = i + 1;
      } else {
        r = i - 1;
      }
    }
  };

  TickList.nextInitializedTick = function nextInitializedTick(ticks, tick, lte) {
    if (lte) {
      !!TickList.isBelowSmallest(ticks, tick) ? process.env.NODE_ENV !== "production" ? invariant(false, 'BELOW_SMALLEST') : invariant(false) : void 0;

      if (TickList.isAtOrAboveLargest(ticks, tick)) {
        return ticks[ticks.length - 1];
      }

      var index = this.binarySearch(ticks, tick);
      return ticks[index];
    } else {
      !!this.isAtOrAboveLargest(ticks, tick) ? process.env.NODE_ENV !== "production" ? invariant(false, 'AT_OR_ABOVE_LARGEST') : invariant(false) : void 0;

      if (this.isBelowSmallest(ticks, tick)) {
        return ticks[0];
      }

      var _index = this.binarySearch(ticks, tick);

      return ticks[_index + 1];
    }
  };

  TickList.nextInitializedTickWithinOneWord = function nextInitializedTickWithinOneWord(ticks, tick, lte, tickSpacing) {
    var compressed = Math.floor(tick / tickSpacing); // matches rounding in the code

    if (lte) {
      var wordPos = compressed >> 8;
      var minimum = (wordPos << 8) * tickSpacing;

      if (TickList.isBelowSmallest(ticks, tick)) {
        return [minimum, false];
      }

      var index = TickList.nextInitializedTick(ticks, tick, lte).index;
      var nextInitializedTick = Math.max(minimum, index);
      return [nextInitializedTick, nextInitializedTick === index];
    } else {
      var _wordPos = compressed + 1 >> 8;

      var maximum = ((_wordPos + 1 << 8) - 1) * tickSpacing;

      if (this.isAtOrAboveLargest(ticks, tick)) {
        return [maximum, false];
      }

      var _index2 = this.nextInitializedTick(ticks, tick, lte).index;

      var _nextInitializedTick = Math.min(maximum, _index2);

      return [_nextInitializedTick, _nextInitializedTick === _index2];
    }
  };

  return TickList;
}();

/**
 * Converts a big int to a hex string
 * @param bigintIsh
 * @returns The hex encoded calldata
 */

function toHex(bigintIsh) {
  var bigInt = JSBI.BigInt(bigintIsh);
  var hex = bigInt.toString(16);

  if (hex.length % 2 !== 0) {
    hex = "0" + hex;
  }

  return "0x" + hex;
}

/**
 * Converts a route to a hex encoded path
 * @param route the v3 path to convert to an encoded path
 * @param exactOutput whether the route should be encoded in reverse, for making exact output swaps
 */

function encodeRouteToPath(route, exactOutput) {
  var firstInputToken = route.input.wrapped;

  var _route$pools$reduce = route.pools.reduce(function (_ref, pool, index) {
    var inputToken = _ref.inputToken,
        path = _ref.path,
        types = _ref.types;
    var outputToken = pool.token0.equals(inputToken) ? pool.token1 : pool.token0;

    if (index === 0) {
      return {
        inputToken: outputToken,
        types: ['address', 'uint24', 'address'],
        path: [inputToken.address, pool.fee, outputToken.address]
      };
    } else {
      return {
        inputToken: outputToken,
        types: [].concat(types, ['uint24', 'address']),
        path: [].concat(path, [pool.fee, outputToken.address])
      };
    }
  }, {
    inputToken: firstInputToken,
    path: [],
    types: []
  }),
      path = _route$pools$reduce.path,
      types = _route$pools$reduce.types;

  return exactOutput ? pack(types.reverse(), path.reverse()) : pack(types, path);
}

/**
 * Returns the sqrt ratio as a Q64.96 corresponding to a given ratio of amount1 and amount0
 * @param amount1 The numerator amount i.e., the amount of token1
 * @param amount0 The denominator amount i.e., the amount of token0
 * @returns The sqrt ratio
 */

function encodeSqrtRatioX96(amount1, amount0) {
  var numerator = JSBI.leftShift(JSBI.BigInt(amount1), JSBI.BigInt(192));
  var denominator = JSBI.BigInt(amount0);
  var ratioX192 = JSBI.divide(numerator, denominator);
  return sqrt(ratioX192);
}

/**
 * Returns an imprecise maximum amount of liquidity received for a given amount of token 0.
 * This function is available to accommodate LiquidityAmounts#getLiquidityForAmount0 in the v3 periphery,
 * which could be more precise by at least 32 bits by dividing by Q64 instead of Q96 in the intermediate step,
 * and shifting the subtracted ratio left by 32 bits. This imprecise calculation will likely be replaced in a future
 * v3 router contract.
 * @param sqrtRatioAX96 The price at the lower boundary
 * @param sqrtRatioBX96 The price at the upper boundary
 * @param amount0 The token0 amount
 * @returns liquidity for amount0, imprecise
 */

function maxLiquidityForAmount0Imprecise(sqrtRatioAX96, sqrtRatioBX96, amount0) {
  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    var _ref = [sqrtRatioBX96, sqrtRatioAX96];
    sqrtRatioAX96 = _ref[0];
    sqrtRatioBX96 = _ref[1];
  }

  var intermediate = JSBI.divide(JSBI.multiply(sqrtRatioAX96, sqrtRatioBX96), Q96);
  return JSBI.divide(JSBI.multiply(JSBI.BigInt(amount0), intermediate), JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96));
}
/**
 * Returns a precise maximum amount of liquidity received for a given amount of token 0 by dividing by Q64 instead of Q96 in the intermediate step,
 * and shifting the subtracted ratio left by 32 bits.
 * @param sqrtRatioAX96 The price at the lower boundary
 * @param sqrtRatioBX96 The price at the upper boundary
 * @param amount0 The token0 amount
 * @returns liquidity for amount0, precise
 */


function maxLiquidityForAmount0Precise(sqrtRatioAX96, sqrtRatioBX96, amount0) {
  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    var _ref2 = [sqrtRatioBX96, sqrtRatioAX96];
    sqrtRatioAX96 = _ref2[0];
    sqrtRatioBX96 = _ref2[1];
  }

  var numerator = JSBI.multiply(JSBI.multiply(JSBI.BigInt(amount0), sqrtRatioAX96), sqrtRatioBX96);
  var denominator = JSBI.multiply(Q96, JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96));
  return JSBI.divide(numerator, denominator);
}
/**
 * Computes the maximum amount of liquidity received for a given amount of token1
 * @param sqrtRatioAX96 The price at the lower tick boundary
 * @param sqrtRatioBX96 The price at the upper tick boundary
 * @param amount1 The token1 amount
 * @returns liquidity for amount1
 */


function maxLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1) {
  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    var _ref3 = [sqrtRatioBX96, sqrtRatioAX96];
    sqrtRatioAX96 = _ref3[0];
    sqrtRatioBX96 = _ref3[1];
  }

  return JSBI.divide(JSBI.multiply(JSBI.BigInt(amount1), Q96), JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96));
}
/**
 * Computes the maximum amount of liquidity received for a given amount of token0, token1,
 * and the prices at the tick boundaries.
 * @param sqrtRatioCurrentX96 the current price
 * @param sqrtRatioAX96 price at lower boundary
 * @param sqrtRatioBX96 price at upper boundary
 * @param amount0 token0 amount
 * @param amount1 token1 amount
 * @param useFullPrecision if false, liquidity will be maximized according to what the router can calculate,
 * not what core can theoretically support
 */


function maxLiquidityForAmounts(sqrtRatioCurrentX96, sqrtRatioAX96, sqrtRatioBX96, amount0, amount1, useFullPrecision) {
  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    var _ref4 = [sqrtRatioBX96, sqrtRatioAX96];
    sqrtRatioAX96 = _ref4[0];
    sqrtRatioBX96 = _ref4[1];
  }

  var maxLiquidityForAmount0 = useFullPrecision ? maxLiquidityForAmount0Precise : maxLiquidityForAmount0Imprecise;

  if (JSBI.lessThanOrEqual(sqrtRatioCurrentX96, sqrtRatioAX96)) {
    return maxLiquidityForAmount0(sqrtRatioAX96, sqrtRatioBX96, amount0);
  } else if (JSBI.lessThan(sqrtRatioCurrentX96, sqrtRatioBX96)) {
    var liquidity0 = maxLiquidityForAmount0(sqrtRatioCurrentX96, sqrtRatioBX96, amount0);
    var liquidity1 = maxLiquidityForAmount1(sqrtRatioAX96, sqrtRatioCurrentX96, amount1);
    return JSBI.lessThan(liquidity0, liquidity1) ? liquidity0 : liquidity1;
  } else {
    return maxLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1);
  }
}

/**
 * Returns the closest tick that is nearest a given tick and usable for the given tick spacing
 * @param tick the target tick
 * @param tickSpacing the spacing of the pool
 */

function nearestUsableTick(tick, tickSpacing) {
  !(Number.isInteger(tick) && Number.isInteger(tickSpacing)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'INTEGERS') : invariant(false) : void 0;
  !(tickSpacing > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TICK_SPACING') : invariant(false) : void 0;
  !(tick >= TickMath.MIN_TICK && tick <= TickMath.MAX_TICK) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TICK_BOUND') : invariant(false) : void 0;
  var rounded = Math.round(tick / tickSpacing) * tickSpacing;
  if (rounded < TickMath.MIN_TICK) return rounded + tickSpacing;else if (rounded > TickMath.MAX_TICK) return rounded - tickSpacing;else return rounded;
}

var Q128 = /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(2), /*#__PURE__*/JSBI.BigInt(128));
var PositionLibrary = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function PositionLibrary() {} // replicates the portions of Position#update required to compute unaccounted fees


  PositionLibrary.getTokensOwed = function getTokensOwed(feeGrowthInside0LastX128, feeGrowthInside1LastX128, liquidity, feeGrowthInside0X128, feeGrowthInside1X128) {
    var tokensOwed0 = JSBI.divide(JSBI.multiply(subIn256(feeGrowthInside0X128, feeGrowthInside0LastX128), liquidity), Q128);
    var tokensOwed1 = JSBI.divide(JSBI.multiply(subIn256(feeGrowthInside1X128, feeGrowthInside1LastX128), liquidity), Q128);
    return [tokensOwed0, tokensOwed1];
  };

  return PositionLibrary;
}();

/**
 * Returns a price object corresponding to the input tick and the base/quote token
 * Inputs must be tokens because the address order is used to interpret the price represented by the tick
 * @param baseToken the base token of the price
 * @param quoteToken the quote token of the price
 * @param tick the tick for which to return the price
 */

function tickToPrice(baseToken, quoteToken, tick) {
  var sqrtRatioX96 = TickMath.getSqrtRatioAtTick(tick);
  var ratioX192 = JSBI.multiply(sqrtRatioX96, sqrtRatioX96);
  return baseToken.sortsBefore(quoteToken) ? new Price(baseToken, quoteToken, Q192, ratioX192) : new Price(baseToken, quoteToken, ratioX192, Q192);
}
/**
 * Returns the first tick for which the given price is greater than or equal to the tick price
 * @param price for which to return the closest tick that represents a price less than or equal to the input price,
 * i.e. the price of the returned tick is less than or equal to the input price
 */

function priceToClosestTick(price) {
  var sorted = price.baseCurrency.sortsBefore(price.quoteCurrency);
  var sqrtRatioX96 = sorted ? encodeSqrtRatioX96(price.numerator, price.denominator) : encodeSqrtRatioX96(price.denominator, price.numerator);
  var tick = TickMath.getTickAtSqrtRatio(sqrtRatioX96);
  var nextTickPrice = tickToPrice(price.baseCurrency, price.quoteCurrency, tick + 1);

  if (sorted) {
    if (!price.lessThan(nextTickPrice)) {
      tick++;
    }
  } else {
    if (!price.greaterThan(nextTickPrice)) {
      tick++;
    }
  }

  return tick;
}

var Q256 = /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(2), /*#__PURE__*/JSBI.BigInt(256));
function subIn256(x, y) {
  var difference = JSBI.subtract(x, y);

  if (JSBI.lessThan(difference, ZERO)) {
    return JSBI.add(Q256, difference);
  } else {
    return difference;
  }
}
var TickLibrary = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function TickLibrary() {}

  TickLibrary.getFeeGrowthInside = function getFeeGrowthInside(feeGrowthOutsideLower, feeGrowthOutsideUpper, tickLower, tickUpper, tickCurrent, feeGrowthGlobal0X128, feeGrowthGlobal1X128) {
    var feeGrowthBelow0X128;
    var feeGrowthBelow1X128;

    if (tickCurrent >= tickLower) {
      feeGrowthBelow0X128 = feeGrowthOutsideLower.feeGrowthOutside0X128;
      feeGrowthBelow1X128 = feeGrowthOutsideLower.feeGrowthOutside1X128;
    } else {
      feeGrowthBelow0X128 = subIn256(feeGrowthGlobal0X128, feeGrowthOutsideLower.feeGrowthOutside0X128);
      feeGrowthBelow1X128 = subIn256(feeGrowthGlobal1X128, feeGrowthOutsideLower.feeGrowthOutside1X128);
    }

    var feeGrowthAbove0X128;
    var feeGrowthAbove1X128;

    if (tickCurrent < tickUpper) {
      feeGrowthAbove0X128 = feeGrowthOutsideUpper.feeGrowthOutside0X128;
      feeGrowthAbove1X128 = feeGrowthOutsideUpper.feeGrowthOutside1X128;
    } else {
      feeGrowthAbove0X128 = subIn256(feeGrowthGlobal0X128, feeGrowthOutsideUpper.feeGrowthOutside0X128);
      feeGrowthAbove1X128 = subIn256(feeGrowthGlobal1X128, feeGrowthOutsideUpper.feeGrowthOutside1X128);
    }

    return [subIn256(subIn256(feeGrowthGlobal0X128, feeGrowthBelow0X128), feeGrowthAbove0X128), subIn256(subIn256(feeGrowthGlobal1X128, feeGrowthBelow1X128), feeGrowthAbove1X128)];
  };

  return TickLibrary;
}();

var Tick = function Tick(_ref) {
  var index = _ref.index,
      liquidityGross = _ref.liquidityGross,
      liquidityNet = _ref.liquidityNet;
  !(index >= TickMath.MIN_TICK && index <= TickMath.MAX_TICK) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TICK') : invariant(false) : void 0;
  this.index = index;
  this.liquidityGross = JSBI.BigInt(liquidityGross);
  this.liquidityNet = JSBI.BigInt(liquidityNet);
};

/**
 * A data provider for ticks that is backed by an in-memory array of ticks.
 */

var TickListDataProvider = /*#__PURE__*/function () {
  function TickListDataProvider(ticks, tickSpacing) {
    var ticksMapped = ticks.map(function (t) {
      return t instanceof Tick ? t : new Tick(t);
    });
    TickList.validateList(ticksMapped, tickSpacing);
    this.ticks = ticksMapped;
  }

  var _proto = TickListDataProvider.prototype;

  _proto.getTick = /*#__PURE__*/function () {
    var _getTick = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(tick) {
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", TickList.getTick(this.ticks, tick));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function getTick(_x) {
      return _getTick.apply(this, arguments);
    }

    return getTick;
  }();

  _proto.nextInitializedTickWithinOneWord = /*#__PURE__*/function () {
    var _nextInitializedTickWithinOneWord = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(tick, lte, tickSpacing) {
      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", TickList.nextInitializedTickWithinOneWord(this.ticks, tick, lte, tickSpacing));

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function nextInitializedTickWithinOneWord(_x2, _x3, _x4) {
      return _nextInitializedTickWithinOneWord.apply(this, arguments);
    }

    return nextInitializedTickWithinOneWord;
  }();

  return TickListDataProvider;
}();

/**
 * By default, pools will not allow operations that require ticks.
 */

var NO_TICK_DATA_PROVIDER_DEFAULT = /*#__PURE__*/new NoTickDataProvider();
/**
 * Represents a V3 pool
 */

var Pool = /*#__PURE__*/function () {
  /**
   * Construct a pool
   * @param tokenA One of the tokens in the pool
   * @param tokenB The other token in the pool
   * @param fee The fee in hundredths of a bips of the input amount of every swap that is collected by the pool
   * @param sqrtRatioX96 The sqrt of the current ratio of amounts of token1 to token0
   * @param liquidity The current value of in range liquidity
   * @param tickCurrent The current tick of the pool
   * @param ticks The current state of the pool ticks or a data provider that can return tick data
   */
  function Pool(tokenA, tokenB, fee, sqrtRatioX96, liquidity, tickCurrent, ticks) {
    if (ticks === void 0) {
      ticks = NO_TICK_DATA_PROVIDER_DEFAULT;
    }

    !(Number.isInteger(fee) && fee < 1000000) ? process.env.NODE_ENV !== "production" ? invariant(false, 'FEE') : invariant(false) : void 0;
    var tickCurrentSqrtRatioX96 = TickMath.getSqrtRatioAtTick(tickCurrent);
    var nextTickSqrtRatioX96 = TickMath.getSqrtRatioAtTick(tickCurrent + 1);
    !(JSBI.greaterThanOrEqual(JSBI.BigInt(sqrtRatioX96), tickCurrentSqrtRatioX96) && JSBI.lessThanOrEqual(JSBI.BigInt(sqrtRatioX96), nextTickSqrtRatioX96)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'PRICE_BOUNDS') : invariant(false) : void 0;

    var _ref = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];

    this.token0 = _ref[0];
    this.token1 = _ref[1];
    this.fee = fee;
    this.sqrtRatioX96 = JSBI.BigInt(sqrtRatioX96);
    this.liquidity = JSBI.BigInt(liquidity);
    this.tickCurrent = tickCurrent;
    this.tickDataProvider = Array.isArray(ticks) ? new TickListDataProvider(ticks, TICK_SPACINGS[fee]) : ticks;
  }

  Pool.getAddress = function getAddress(tokenA, tokenB, fee, initCodeHashManualOverride, factoryAddressOverride) {
    return computePoolAddress({
      factoryAddress: factoryAddressOverride != null ? factoryAddressOverride : FACTORY_ADDRESS,
      fee: fee,
      tokenA: tokenA,
      tokenB: tokenB,
      initCodeHashManualOverride: initCodeHashManualOverride
    });
  }
  /**
   * Returns true if the token is either token0 or token1
   * @param token The token to check
   * @returns True if token is either token0 or token
   */
  ;

  var _proto = Pool.prototype;

  _proto.involvesToken = function involvesToken(token) {
    return token.equals(this.token0) || token.equals(this.token1);
  }
  /**
   * Returns the current mid price of the pool in terms of token0, i.e. the ratio of token1 over token0
   */
  ;

  /**
   * Return the price of the given token in terms of the other token in the pool.
   * @param token The token to return price of
   * @returns The price of the given token, in terms of the other.
   */
  _proto.priceOf = function priceOf(token) {
    !this.involvesToken(token) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
    return token.equals(this.token0) ? this.token0Price : this.token1Price;
  }
  /**
   * Returns the chain ID of the tokens in the pool.
   */
  ;

  /**
   * Given an input amount of a token, return the computed output amount, and a pool with state updated after the trade
   * @param inputAmount The input amount for which to quote the output amount
   * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit
   * @returns The output amount and the pool with updated state
   */
  _proto.getOutputAmount =
  /*#__PURE__*/
  function () {
    var _getOutputAmount = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(inputAmount, sqrtPriceLimitX96) {
      var zeroForOne, _yield$this$swap, outputAmount, sqrtRatioX96, liquidity, tickCurrent, outputToken;

      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              !this.involvesToken(inputAmount.currency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
              zeroForOne = inputAmount.currency.equals(this.token0);
              _context.next = 4;
              return this.swap(zeroForOne, inputAmount.quotient, sqrtPriceLimitX96);

            case 4:
              _yield$this$swap = _context.sent;
              outputAmount = _yield$this$swap.amountCalculated;
              sqrtRatioX96 = _yield$this$swap.sqrtRatioX96;
              liquidity = _yield$this$swap.liquidity;
              tickCurrent = _yield$this$swap.tickCurrent;
              outputToken = zeroForOne ? this.token1 : this.token0;
              return _context.abrupt("return", [CurrencyAmount.fromRawAmount(outputToken, JSBI.multiply(outputAmount, NEGATIVE_ONE)), new Pool(this.token0, this.token1, this.fee, sqrtRatioX96, liquidity, tickCurrent, this.tickDataProvider)]);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function getOutputAmount(_x, _x2) {
      return _getOutputAmount.apply(this, arguments);
    }

    return getOutputAmount;
  }()
  /**
   * Given a desired output amount of a token, return the computed input amount and a pool with state updated after the trade
   * @param outputAmount the output amount for which to quote the input amount
   * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this value after the swap. If one for zero, the price cannot be greater than this value after the swap
   * @returns The input amount and the pool with updated state
   */
  ;

  _proto.getInputAmount =
  /*#__PURE__*/
  function () {
    var _getInputAmount = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(outputAmount, sqrtPriceLimitX96) {
      var zeroForOne, _yield$this$swap2, inputAmount, sqrtRatioX96, liquidity, tickCurrent, inputToken;

      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              !(outputAmount.currency.isToken && this.involvesToken(outputAmount.currency)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
              zeroForOne = outputAmount.currency.equals(this.token1);
              _context2.next = 4;
              return this.swap(zeroForOne, JSBI.multiply(outputAmount.quotient, NEGATIVE_ONE), sqrtPriceLimitX96);

            case 4:
              _yield$this$swap2 = _context2.sent;
              inputAmount = _yield$this$swap2.amountCalculated;
              sqrtRatioX96 = _yield$this$swap2.sqrtRatioX96;
              liquidity = _yield$this$swap2.liquidity;
              tickCurrent = _yield$this$swap2.tickCurrent;
              inputToken = zeroForOne ? this.token0 : this.token1;
              return _context2.abrupt("return", [CurrencyAmount.fromRawAmount(inputToken, inputAmount), new Pool(this.token0, this.token1, this.fee, sqrtRatioX96, liquidity, tickCurrent, this.tickDataProvider)]);

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function getInputAmount(_x3, _x4) {
      return _getInputAmount.apply(this, arguments);
    }

    return getInputAmount;
  }()
  /**
   * Executes a swap
   * @param zeroForOne Whether the amount in is token0 or token1
   * @param amountSpecified The amount of the swap, which implicitly configures the swap as exact input (positive), or exact output (negative)
   * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this value after the swap. If one for zero, the price cannot be greater than this value after the swap
   * @returns amountCalculated
   * @returns sqrtRatioX96
   * @returns liquidity
   * @returns tickCurrent
   */
  ;

  _proto.swap =
  /*#__PURE__*/
  function () {
    var _swap = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3(zeroForOne, amountSpecified, sqrtPriceLimitX96) {
      var exactInput, state, step, _yield$this$tickDataP, _SwapMath$computeSwap, liquidityNet;

      return runtime_1.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!sqrtPriceLimitX96) sqrtPriceLimitX96 = zeroForOne ? JSBI.add(TickMath.MIN_SQRT_RATIO, ONE) : JSBI.subtract(TickMath.MAX_SQRT_RATIO, ONE);

              if (zeroForOne) {
                !JSBI.greaterThan(sqrtPriceLimitX96, TickMath.MIN_SQRT_RATIO) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RATIO_MIN') : invariant(false) : void 0;
                !JSBI.lessThan(sqrtPriceLimitX96, this.sqrtRatioX96) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RATIO_CURRENT') : invariant(false) : void 0;
              } else {
                !JSBI.lessThan(sqrtPriceLimitX96, TickMath.MAX_SQRT_RATIO) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RATIO_MAX') : invariant(false) : void 0;
                !JSBI.greaterThan(sqrtPriceLimitX96, this.sqrtRatioX96) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RATIO_CURRENT') : invariant(false) : void 0;
              }

              exactInput = JSBI.greaterThanOrEqual(amountSpecified, ZERO); // keep track of swap state

              state = {
                amountSpecifiedRemaining: amountSpecified,
                amountCalculated: ZERO,
                sqrtPriceX96: this.sqrtRatioX96,
                tick: this.tickCurrent,
                liquidity: this.liquidity
              }; // start swap while loop

            case 4:
              if (!(JSBI.notEqual(state.amountSpecifiedRemaining, ZERO) && state.sqrtPriceX96 != sqrtPriceLimitX96)) {
                _context3.next = 35;
                break;
              }

              step = {};
              step.sqrtPriceStartX96 = state.sqrtPriceX96;
              _context3.next = 9;
              return this.tickDataProvider.nextInitializedTickWithinOneWord(state.tick, zeroForOne, this.tickSpacing);

            case 9:
              _yield$this$tickDataP = _context3.sent;
              step.tickNext = _yield$this$tickDataP[0];
              step.initialized = _yield$this$tickDataP[1];

              if (step.tickNext < TickMath.MIN_TICK) {
                step.tickNext = TickMath.MIN_TICK;
              } else if (step.tickNext > TickMath.MAX_TICK) {
                step.tickNext = TickMath.MAX_TICK;
              }

              step.sqrtPriceNextX96 = TickMath.getSqrtRatioAtTick(step.tickNext);
              _SwapMath$computeSwap = SwapMath.computeSwapStep(state.sqrtPriceX96, (zeroForOne ? JSBI.lessThan(step.sqrtPriceNextX96, sqrtPriceLimitX96) : JSBI.greaterThan(step.sqrtPriceNextX96, sqrtPriceLimitX96)) ? sqrtPriceLimitX96 : step.sqrtPriceNextX96, state.liquidity, state.amountSpecifiedRemaining, this.fee);
              state.sqrtPriceX96 = _SwapMath$computeSwap[0];
              step.amountIn = _SwapMath$computeSwap[1];
              step.amountOut = _SwapMath$computeSwap[2];
              step.feeAmount = _SwapMath$computeSwap[3];

              if (exactInput) {
                state.amountSpecifiedRemaining = JSBI.subtract(state.amountSpecifiedRemaining, JSBI.add(step.amountIn, step.feeAmount));
                state.amountCalculated = JSBI.subtract(state.amountCalculated, step.amountOut);
              } else {
                state.amountSpecifiedRemaining = JSBI.add(state.amountSpecifiedRemaining, step.amountOut);
                state.amountCalculated = JSBI.add(state.amountCalculated, JSBI.add(step.amountIn, step.feeAmount));
              } // TODO


              if (!JSBI.equal(state.sqrtPriceX96, step.sqrtPriceNextX96)) {
                _context3.next = 32;
                break;
              }

              if (!step.initialized) {
                _context3.next = 29;
                break;
              }

              _context3.t0 = JSBI;
              _context3.next = 25;
              return this.tickDataProvider.getTick(step.tickNext);

            case 25:
              _context3.t1 = _context3.sent.liquidityNet;
              liquidityNet = _context3.t0.BigInt.call(_context3.t0, _context3.t1);
              // if we're moving leftward, we interpret liquidityNet as the opposite sign
              // safe because liquidityNet cannot be type(int128).min
              if (zeroForOne) liquidityNet = JSBI.multiply(liquidityNet, NEGATIVE_ONE);
              state.liquidity = LiquidityMath.addDelta(state.liquidity, liquidityNet);

            case 29:
              state.tick = zeroForOne ? step.tickNext - 1 : step.tickNext;
              _context3.next = 33;
              break;

            case 32:
              if (JSBI.notEqual(state.sqrtPriceX96, step.sqrtPriceStartX96)) {
                // updated comparison function
                // recompute unless we're on a lower tick boundary (i.e. already transitioned ticks), and haven't moved
                state.tick = TickMath.getTickAtSqrtRatio(state.sqrtPriceX96);
              }

            case 33:
              _context3.next = 4;
              break;

            case 35:
              return _context3.abrupt("return", {
                amountCalculated: state.amountCalculated,
                sqrtRatioX96: state.sqrtPriceX96,
                liquidity: state.liquidity,
                tickCurrent: state.tick
              });

            case 36:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function swap(_x5, _x6, _x7) {
      return _swap.apply(this, arguments);
    }

    return swap;
  }();

  _createClass(Pool, [{
    key: "token0Price",
    get: function get() {
      var _this$_token0Price;

      return (_this$_token0Price = this._token0Price) != null ? _this$_token0Price : this._token0Price = new Price(this.token0, this.token1, Q192, JSBI.multiply(this.sqrtRatioX96, this.sqrtRatioX96));
    }
    /**
     * Returns the current mid price of the pool in terms of token1, i.e. the ratio of token0 over token1
     */

  }, {
    key: "token1Price",
    get: function get() {
      var _this$_token1Price;

      return (_this$_token1Price = this._token1Price) != null ? _this$_token1Price : this._token1Price = new Price(this.token1, this.token0, JSBI.multiply(this.sqrtRatioX96, this.sqrtRatioX96), Q192);
    }
  }, {
    key: "chainId",
    get: function get() {
      return this.token0.chainId;
    }
  }, {
    key: "tickSpacing",
    get: function get() {
      return TICK_SPACINGS[this.fee];
    }
  }]);

  return Pool;
}();

/**
 * Represents a position on a Uniswap V3 Pool
 */

var Position = /*#__PURE__*/function () {
  /**
   * Constructs a position for a given pool with the given liquidity
   * @param pool For which pool the liquidity is assigned
   * @param liquidity The amount of liquidity that is in the position
   * @param tickLower The lower tick of the position
   * @param tickUpper The upper tick of the position
   */
  function Position(_ref) {
    var pool = _ref.pool,
        liquidity = _ref.liquidity,
        tickLower = _ref.tickLower,
        tickUpper = _ref.tickUpper;
    // cached resuts for the getters
    this._token0Amount = null;
    this._token1Amount = null;
    this._mintAmounts = null;
    !(tickLower < tickUpper) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TICK_ORDER') : invariant(false) : void 0;
    !(tickLower >= TickMath.MIN_TICK && tickLower % pool.tickSpacing === 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TICK_LOWER') : invariant(false) : void 0;
    !(tickUpper <= TickMath.MAX_TICK && tickUpper % pool.tickSpacing === 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TICK_UPPER') : invariant(false) : void 0;
    this.pool = pool;
    this.tickLower = tickLower;
    this.tickUpper = tickUpper;
    this.liquidity = JSBI.BigInt(liquidity);
  }
  /**
   * Returns the price of token0 at the lower tick
   */


  var _proto = Position.prototype;

  /**
   * Returns the lower and upper sqrt ratios if the price 'slips' up to slippage tolerance percentage
   * @param slippageTolerance The amount by which the price can 'slip' before the transaction will revert
   * @returns The sqrt ratios after slippage
   */
  _proto.ratiosAfterSlippage = function ratiosAfterSlippage(slippageTolerance) {
    var priceLower = this.pool.token0Price.asFraction.multiply(new Percent(1).subtract(slippageTolerance));
    var priceUpper = this.pool.token0Price.asFraction.multiply(slippageTolerance.add(1));
    var sqrtRatioX96Lower = encodeSqrtRatioX96(priceLower.numerator, priceLower.denominator);

    if (JSBI.lessThanOrEqual(sqrtRatioX96Lower, TickMath.MIN_SQRT_RATIO)) {
      sqrtRatioX96Lower = JSBI.add(TickMath.MIN_SQRT_RATIO, JSBI.BigInt(1));
    }

    var sqrtRatioX96Upper = encodeSqrtRatioX96(priceUpper.numerator, priceUpper.denominator);

    if (JSBI.greaterThanOrEqual(sqrtRatioX96Upper, TickMath.MAX_SQRT_RATIO)) {
      sqrtRatioX96Upper = JSBI.subtract(TickMath.MAX_SQRT_RATIO, JSBI.BigInt(1));
    }

    return {
      sqrtRatioX96Lower: sqrtRatioX96Lower,
      sqrtRatioX96Upper: sqrtRatioX96Upper
    };
  }
  /**
   * Returns the minimum amounts that must be sent in order to safely mint the amount of liquidity held by the position
   * with the given slippage tolerance
   * @param slippageTolerance Tolerance of unfavorable slippage from the current price
   * @returns The amounts, with slippage
   */
  ;

  _proto.mintAmountsWithSlippage = function mintAmountsWithSlippage(slippageTolerance) {
    // get lower/upper prices
    var _this$ratiosAfterSlip = this.ratiosAfterSlippage(slippageTolerance),
        sqrtRatioX96Upper = _this$ratiosAfterSlip.sqrtRatioX96Upper,
        sqrtRatioX96Lower = _this$ratiosAfterSlip.sqrtRatioX96Lower; // construct counterfactual pools


    var poolLower = new Pool(this.pool.token0, this.pool.token1, this.pool.fee, sqrtRatioX96Lower, 0
    /* liquidity doesn't matter */
    , TickMath.getTickAtSqrtRatio(sqrtRatioX96Lower));
    var poolUpper = new Pool(this.pool.token0, this.pool.token1, this.pool.fee, sqrtRatioX96Upper, 0
    /* liquidity doesn't matter */
    , TickMath.getTickAtSqrtRatio(sqrtRatioX96Upper)); // because the router is imprecise, we need to calculate the position that will be created (assuming no slippage)

    var positionThatWillBeCreated = Position.fromAmounts(_extends({
      pool: this.pool,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }, this.mintAmounts, {
      useFullPrecision: false
    })); // we want the smaller amounts...
    // ...which occurs at the upper price for amount0...

    var amount0 = new Position({
      pool: poolUpper,
      liquidity: positionThatWillBeCreated.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }).mintAmounts.amount0; // ...and the lower for amount1

    var amount1 = new Position({
      pool: poolLower,
      liquidity: positionThatWillBeCreated.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }).mintAmounts.amount1;
    return {
      amount0: amount0,
      amount1: amount1
    };
  }
  /**
   * Returns the minimum amounts that should be requested in order to safely burn the amount of liquidity held by the
   * position with the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the current price
   * @returns The amounts, with slippage
   */
  ;

  _proto.burnAmountsWithSlippage = function burnAmountsWithSlippage(slippageTolerance) {
    // get lower/upper prices
    var _this$ratiosAfterSlip2 = this.ratiosAfterSlippage(slippageTolerance),
        sqrtRatioX96Upper = _this$ratiosAfterSlip2.sqrtRatioX96Upper,
        sqrtRatioX96Lower = _this$ratiosAfterSlip2.sqrtRatioX96Lower; // construct counterfactual pools


    var poolLower = new Pool(this.pool.token0, this.pool.token1, this.pool.fee, sqrtRatioX96Lower, 0
    /* liquidity doesn't matter */
    , TickMath.getTickAtSqrtRatio(sqrtRatioX96Lower));
    var poolUpper = new Pool(this.pool.token0, this.pool.token1, this.pool.fee, sqrtRatioX96Upper, 0
    /* liquidity doesn't matter */
    , TickMath.getTickAtSqrtRatio(sqrtRatioX96Upper)); // we want the smaller amounts...
    // ...which occurs at the upper price for amount0...

    var amount0 = new Position({
      pool: poolUpper,
      liquidity: this.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }).amount0; // ...and the lower for amount1

    var amount1 = new Position({
      pool: poolLower,
      liquidity: this.liquidity,
      tickLower: this.tickLower,
      tickUpper: this.tickUpper
    }).amount1;
    return {
      amount0: amount0.quotient,
      amount1: amount1.quotient
    };
  }
  /**
   * Returns the minimum amounts that must be sent in order to mint the amount of liquidity held by the position at
   * the current price for the pool
   */
  ;

  /**
   * Computes the maximum amount of liquidity received for a given amount of token0, token1,
   * and the prices at the tick boundaries.
   * @param pool The pool for which the position should be created
   * @param tickLower The lower tick of the position
   * @param tickUpper The upper tick of the position
   * @param amount0 token0 amount
   * @param amount1 token1 amount
   * @param useFullPrecision If false, liquidity will be maximized according to what the router can calculate,
   * not what core can theoretically support
   * @returns The amount of liquidity for the position
   */
  Position.fromAmounts = function fromAmounts(_ref2) {
    var pool = _ref2.pool,
        tickLower = _ref2.tickLower,
        tickUpper = _ref2.tickUpper,
        amount0 = _ref2.amount0,
        amount1 = _ref2.amount1,
        useFullPrecision = _ref2.useFullPrecision;
    var sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(tickLower);
    var sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(tickUpper);
    return new Position({
      pool: pool,
      tickLower: tickLower,
      tickUpper: tickUpper,
      liquidity: maxLiquidityForAmounts(pool.sqrtRatioX96, sqrtRatioAX96, sqrtRatioBX96, amount0, amount1, useFullPrecision)
    });
  }
  /**
   * Computes a position with the maximum amount of liquidity received for a given amount of token0, assuming an unlimited amount of token1
   * @param pool The pool for which the position is created
   * @param tickLower The lower tick
   * @param tickUpper The upper tick
   * @param amount0 The desired amount of token0
   * @param useFullPrecision If true, liquidity will be maximized according to what the router can calculate,
   * not what core can theoretically support
   * @returns The position
   */
  ;

  Position.fromAmount0 = function fromAmount0(_ref3) {
    var pool = _ref3.pool,
        tickLower = _ref3.tickLower,
        tickUpper = _ref3.tickUpper,
        amount0 = _ref3.amount0,
        useFullPrecision = _ref3.useFullPrecision;
    return Position.fromAmounts({
      pool: pool,
      tickLower: tickLower,
      tickUpper: tickUpper,
      amount0: amount0,
      amount1: MaxUint256,
      useFullPrecision: useFullPrecision
    });
  }
  /**
   * Computes a position with the maximum amount of liquidity received for a given amount of token1, assuming an unlimited amount of token0
   * @param pool The pool for which the position is created
   * @param tickLower The lower tick
   * @param tickUpper The upper tick
   * @param amount1 The desired amount of token1
   * @returns The position
   */
  ;

  Position.fromAmount1 = function fromAmount1(_ref4) {
    var pool = _ref4.pool,
        tickLower = _ref4.tickLower,
        tickUpper = _ref4.tickUpper,
        amount1 = _ref4.amount1;
    // this function always uses full precision,
    return Position.fromAmounts({
      pool: pool,
      tickLower: tickLower,
      tickUpper: tickUpper,
      amount0: MaxUint256,
      amount1: amount1,
      useFullPrecision: true
    });
  };

  _createClass(Position, [{
    key: "token0PriceLower",
    get: function get() {
      return tickToPrice(this.pool.token0, this.pool.token1, this.tickLower);
    }
    /**
     * Returns the price of token0 at the upper tick
     */

  }, {
    key: "token0PriceUpper",
    get: function get() {
      return tickToPrice(this.pool.token0, this.pool.token1, this.tickUpper);
    }
    /**
     * Returns the amount of token0 that this position's liquidity could be burned for at the current pool price
     */

  }, {
    key: "amount0",
    get: function get() {
      if (this._token0Amount === null) {
        if (this.pool.tickCurrent < this.tickLower) {
          this._token0Amount = CurrencyAmount.fromRawAmount(this.pool.token0, SqrtPriceMath.getAmount0Delta(TickMath.getSqrtRatioAtTick(this.tickLower), TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, false));
        } else if (this.pool.tickCurrent < this.tickUpper) {
          this._token0Amount = CurrencyAmount.fromRawAmount(this.pool.token0, SqrtPriceMath.getAmount0Delta(this.pool.sqrtRatioX96, TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, false));
        } else {
          this._token0Amount = CurrencyAmount.fromRawAmount(this.pool.token0, ZERO);
        }
      }

      return this._token0Amount;
    }
    /**
     * Returns the amount of token1 that this position's liquidity could be burned for at the current pool price
     */

  }, {
    key: "amount1",
    get: function get() {
      if (this._token1Amount === null) {
        if (this.pool.tickCurrent < this.tickLower) {
          this._token1Amount = CurrencyAmount.fromRawAmount(this.pool.token1, ZERO);
        } else if (this.pool.tickCurrent < this.tickUpper) {
          this._token1Amount = CurrencyAmount.fromRawAmount(this.pool.token1, SqrtPriceMath.getAmount1Delta(TickMath.getSqrtRatioAtTick(this.tickLower), this.pool.sqrtRatioX96, this.liquidity, false));
        } else {
          this._token1Amount = CurrencyAmount.fromRawAmount(this.pool.token1, SqrtPriceMath.getAmount1Delta(TickMath.getSqrtRatioAtTick(this.tickLower), TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, false));
        }
      }

      return this._token1Amount;
    }
  }, {
    key: "mintAmounts",
    get: function get() {
      if (this._mintAmounts === null) {
        if (this.pool.tickCurrent < this.tickLower) {
          return {
            amount0: SqrtPriceMath.getAmount0Delta(TickMath.getSqrtRatioAtTick(this.tickLower), TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, true),
            amount1: ZERO
          };
        } else if (this.pool.tickCurrent < this.tickUpper) {
          return {
            amount0: SqrtPriceMath.getAmount0Delta(this.pool.sqrtRatioX96, TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, true),
            amount1: SqrtPriceMath.getAmount1Delta(TickMath.getSqrtRatioAtTick(this.tickLower), this.pool.sqrtRatioX96, this.liquidity, true)
          };
        } else {
          return {
            amount0: ZERO,
            amount1: SqrtPriceMath.getAmount1Delta(TickMath.getSqrtRatioAtTick(this.tickLower), TickMath.getSqrtRatioAtTick(this.tickUpper), this.liquidity, true)
          };
        }
      }

      return this._mintAmounts;
    }
  }]);

  return Position;
}();

/**
 * Represents a list of pools through which a swap can occur
 * @template TInput The input token
 * @template TOutput The output token
 */

var Route = /*#__PURE__*/function () {
  /**
   * Creates an instance of route.
   * @param pools An array of `Pool` objects, ordered by the route the swap will take
   * @param input The input token
   * @param output The output token
   */
  function Route(pools, input, output) {
    this._midPrice = null;
    !(pools.length > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'POOLS') : invariant(false) : void 0;
    var chainId = pools[0].chainId;
    var allOnSameChain = pools.every(function (pool) {
      return pool.chainId === chainId;
    });
    !allOnSameChain ? process.env.NODE_ENV !== "production" ? invariant(false, 'CHAIN_IDS') : invariant(false) : void 0;
    var wrappedInput = input.wrapped;
    !pools[0].involvesToken(wrappedInput) ? process.env.NODE_ENV !== "production" ? invariant(false, 'INPUT') : invariant(false) : void 0;
    !pools[pools.length - 1].involvesToken(output.wrapped) ? process.env.NODE_ENV !== "production" ? invariant(false, 'OUTPUT') : invariant(false) : void 0;
    /**
     * Normalizes token0-token1 order and selects the next token/fee step to add to the path
     * */

    var tokenPath = [wrappedInput];

    for (var _iterator = _createForOfIteratorHelperLoose(pools.entries()), _step; !(_step = _iterator()).done;) {
      var _step$value = _step.value,
          i = _step$value[0],
          pool = _step$value[1];
      var currentInputToken = tokenPath[i];
      !(currentInputToken.equals(pool.token0) || currentInputToken.equals(pool.token1)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'PATH') : invariant(false) : void 0;
      var nextToken = currentInputToken.equals(pool.token0) ? pool.token1 : pool.token0;
      tokenPath.push(nextToken);
    }

    this.pools = pools;
    this.tokenPath = tokenPath;
    this.input = input;
    this.output = output != null ? output : tokenPath[tokenPath.length - 1];
  }

  _createClass(Route, [{
    key: "chainId",
    get: function get() {
      return this.pools[0].chainId;
    }
    /**
     * Returns the mid price of the route
     */

  }, {
    key: "midPrice",
    get: function get() {
      if (this._midPrice !== null) return this._midPrice;
      var price = this.pools.slice(1).reduce(function (_ref, pool) {
        var nextInput = _ref.nextInput,
            price = _ref.price;
        return nextInput.equals(pool.token0) ? {
          nextInput: pool.token1,
          price: price.multiply(pool.token0Price)
        } : {
          nextInput: pool.token0,
          price: price.multiply(pool.token1Price)
        };
      }, this.pools[0].token0.equals(this.input.wrapped) ? {
        nextInput: this.pools[0].token1,
        price: this.pools[0].token0Price
      } : {
        nextInput: this.pools[0].token0,
        price: this.pools[0].token1Price
      }).price;
      return this._midPrice = new Price(this.input, this.output, price.denominator, price.numerator);
    }
  }]);

  return Route;
}();

/**
 * Trades comparator, an extension of the input output comparator that also considers other dimensions of the trade in ranking them
 * @template TInput The input token, either Ether or an ERC-20
 * @template TOutput The output token, either Ether or an ERC-20
 * @template TTradeType The trade type, either exact input or exact output
 * @param a The first trade to compare
 * @param b The second trade to compare
 * @returns A sorted ordering for two neighboring elements in a trade array
 */

function tradeComparator(a, b) {
  // must have same input and output token for comparison
  !a.inputAmount.currency.equals(b.inputAmount.currency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'INPUT_CURRENCY') : invariant(false) : void 0;
  !a.outputAmount.currency.equals(b.outputAmount.currency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'OUTPUT_CURRENCY') : invariant(false) : void 0;

  if (a.outputAmount.equalTo(b.outputAmount)) {
    if (a.inputAmount.equalTo(b.inputAmount)) {
      // consider the number of hops since each hop costs gas
      var aHops = a.swaps.reduce(function (total, cur) {
        return total + cur.route.tokenPath.length;
      }, 0);
      var bHops = b.swaps.reduce(function (total, cur) {
        return total + cur.route.tokenPath.length;
      }, 0);
      return aHops - bHops;
    } // trade A requires less input than trade B, so A should come first


    if (a.inputAmount.lessThan(b.inputAmount)) {
      return -1;
    } else {
      return 1;
    }
  } else {
    // tradeA has less output than trade B, so should come second
    if (a.outputAmount.lessThan(b.outputAmount)) {
      return 1;
    } else {
      return -1;
    }
  }
}
/**
 * Represents a trade executed against a set of routes where some percentage of the input is
 * split across each route.
 *
 * Each route has its own set of pools. Pools can not be re-used across routes.
 *
 * Does not account for slippage, i.e., changes in price environment that can occur between
 * the time the trade is submitted and when it is executed.
 * @template TInput The input token, either Ether or an ERC-20
 * @template TOutput The output token, either Ether or an ERC-20
 * @template TTradeType The trade type, either exact input or exact output
 */

var Trade = /*#__PURE__*/function () {
  /**
   * Construct a trade by passing in the pre-computed property values
   * @param routes The routes through which the trade occurs
   * @param tradeType The type of trade, exact input or exact output
   */
  function Trade(_ref) {
    var routes = _ref.routes,
        tradeType = _ref.tradeType;
    var inputCurrency = routes[0].inputAmount.currency;
    var outputCurrency = routes[0].outputAmount.currency;
    !routes.every(function (_ref2) {
      var route = _ref2.route;
      return inputCurrency.wrapped.equals(route.input.wrapped);
    }) ? process.env.NODE_ENV !== "production" ? invariant(false, 'INPUT_CURRENCY_MATCH') : invariant(false) : void 0;
    !routes.every(function (_ref3) {
      var route = _ref3.route;
      return outputCurrency.wrapped.equals(route.output.wrapped);
    }) ? process.env.NODE_ENV !== "production" ? invariant(false, 'OUTPUT_CURRENCY_MATCH') : invariant(false) : void 0;
    var numPools = routes.map(function (_ref4) {
      var route = _ref4.route;
      return route.pools.length;
    }).reduce(function (total, cur) {
      return total + cur;
    }, 0);
    var poolAddressSet = new Set();

    for (var _iterator = _createForOfIteratorHelperLoose(routes), _step; !(_step = _iterator()).done;) {
      var route = _step.value.route;

      for (var _iterator2 = _createForOfIteratorHelperLoose(route.pools), _step2; !(_step2 = _iterator2()).done;) {
        var pool = _step2.value;
        poolAddressSet.add(Pool.getAddress(pool.token0, pool.token1, pool.fee));
      }
    }

    !(numPools == poolAddressSet.size) ? process.env.NODE_ENV !== "production" ? invariant(false, 'POOLS_DUPLICATED') : invariant(false) : void 0;
    this.swaps = routes;
    this.tradeType = tradeType;
  }
  /**
   * @deprecated Deprecated in favor of 'swaps' property. If the trade consists of multiple routes
   * this will return an error.
   *
   * When the trade consists of just a single route, this returns the route of the trade,
   * i.e. which pools the trade goes through.
   */


  /**
   * Constructs an exact in trade with the given amount in and route
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @param route The route of the exact in trade
   * @param amountIn The amount being passed in
   * @returns The exact in trade
   */
  Trade.exactIn =
  /*#__PURE__*/
  function () {
    var _exactIn = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(route, amountIn) {
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", Trade.fromRoute(route, amountIn, TradeType.EXACT_INPUT));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function exactIn(_x, _x2) {
      return _exactIn.apply(this, arguments);
    }

    return exactIn;
  }()
  /**
   * Constructs an exact out trade with the given amount out and route
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @param route The route of the exact out trade
   * @param amountOut The amount returned by the trade
   * @returns The exact out trade
   */
  ;

  Trade.exactOut =
  /*#__PURE__*/
  function () {
    var _exactOut = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(route, amountOut) {
      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", Trade.fromRoute(route, amountOut, TradeType.EXACT_OUTPUT));

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    function exactOut(_x3, _x4) {
      return _exactOut.apply(this, arguments);
    }

    return exactOut;
  }()
  /**
   * Constructs a trade by simulating swaps through the given route
   * @template TInput The input token, either Ether or an ERC-20.
   * @template TOutput The output token, either Ether or an ERC-20.
   * @template TTradeType The type of the trade, either exact in or exact out.
   * @param route route to swap through
   * @param amount the amount specified, either input or output, depending on tradeType
   * @param tradeType whether the trade is an exact input or exact output swap
   * @returns The route
   */
  ;

  Trade.fromRoute =
  /*#__PURE__*/
  function () {
    var _fromRoute = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3(route, amount, tradeType) {
      var amounts, inputAmount, outputAmount, i, pool, _yield$pool$getOutput, _outputAmount, _i, _pool, _yield$_pool$getInput, _inputAmount;

      return runtime_1.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              amounts = new Array(route.tokenPath.length);

              if (!(tradeType === TradeType.EXACT_INPUT)) {
                _context3.next = 19;
                break;
              }

              !amount.currency.equals(route.input) ? process.env.NODE_ENV !== "production" ? invariant(false, 'INPUT') : invariant(false) : void 0;
              amounts[0] = amount.wrapped;
              i = 0;

            case 5:
              if (!(i < route.tokenPath.length - 1)) {
                _context3.next = 15;
                break;
              }

              pool = route.pools[i];
              _context3.next = 9;
              return pool.getOutputAmount(amounts[i]);

            case 9:
              _yield$pool$getOutput = _context3.sent;
              _outputAmount = _yield$pool$getOutput[0];
              amounts[i + 1] = _outputAmount;

            case 12:
              i++;
              _context3.next = 5;
              break;

            case 15:
              inputAmount = CurrencyAmount.fromFractionalAmount(route.input, amount.numerator, amount.denominator);
              outputAmount = CurrencyAmount.fromFractionalAmount(route.output, amounts[amounts.length - 1].numerator, amounts[amounts.length - 1].denominator);
              _context3.next = 34;
              break;

            case 19:
              !amount.currency.equals(route.output) ? process.env.NODE_ENV !== "production" ? invariant(false, 'OUTPUT') : invariant(false) : void 0;
              amounts[amounts.length - 1] = amount.wrapped;
              _i = route.tokenPath.length - 1;

            case 22:
              if (!(_i > 0)) {
                _context3.next = 32;
                break;
              }

              _pool = route.pools[_i - 1];
              _context3.next = 26;
              return _pool.getInputAmount(amounts[_i]);

            case 26:
              _yield$_pool$getInput = _context3.sent;
              _inputAmount = _yield$_pool$getInput[0];
              amounts[_i - 1] = _inputAmount;

            case 29:
              _i--;
              _context3.next = 22;
              break;

            case 32:
              inputAmount = CurrencyAmount.fromFractionalAmount(route.input, amounts[0].numerator, amounts[0].denominator);
              outputAmount = CurrencyAmount.fromFractionalAmount(route.output, amount.numerator, amount.denominator);

            case 34:
              return _context3.abrupt("return", new Trade({
                routes: [{
                  inputAmount: inputAmount,
                  outputAmount: outputAmount,
                  route: route
                }],
                tradeType: tradeType
              }));

            case 35:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    function fromRoute(_x5, _x6, _x7) {
      return _fromRoute.apply(this, arguments);
    }

    return fromRoute;
  }()
  /**
   * Constructs a trade from routes by simulating swaps
   *
   * @template TInput The input token, either Ether or an ERC-20.
   * @template TOutput The output token, either Ether or an ERC-20.
   * @template TTradeType The type of the trade, either exact in or exact out.
   * @param routes the routes to swap through and how much of the amount should be routed through each
   * @param tradeType whether the trade is an exact input or exact output swap
   * @returns The trade
   */
  ;

  Trade.fromRoutes =
  /*#__PURE__*/
  function () {
    var _fromRoutes = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee4(routes, tradeType) {
      var populatedRoutes, _iterator3, _step3, _step3$value, route, amount, amounts, inputAmount, outputAmount, i, pool, _yield$pool$getOutput2, _outputAmount2, _i2, _pool2, _yield$_pool2$getInpu, _inputAmount2;

      return runtime_1.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              populatedRoutes = [];
              _iterator3 = _createForOfIteratorHelperLoose(routes);

            case 2:
              if ((_step3 = _iterator3()).done) {
                _context4.next = 43;
                break;
              }

              _step3$value = _step3.value, route = _step3$value.route, amount = _step3$value.amount;
              amounts = new Array(route.tokenPath.length);
              inputAmount = void 0;
              outputAmount = void 0;

              if (!(tradeType === TradeType.EXACT_INPUT)) {
                _context4.next = 25;
                break;
              }

              !amount.currency.equals(route.input) ? process.env.NODE_ENV !== "production" ? invariant(false, 'INPUT') : invariant(false) : void 0;
              inputAmount = CurrencyAmount.fromFractionalAmount(route.input, amount.numerator, amount.denominator);
              amounts[0] = CurrencyAmount.fromFractionalAmount(route.input.wrapped, amount.numerator, amount.denominator);
              i = 0;

            case 12:
              if (!(i < route.tokenPath.length - 1)) {
                _context4.next = 22;
                break;
              }

              pool = route.pools[i];
              _context4.next = 16;
              return pool.getOutputAmount(amounts[i]);

            case 16:
              _yield$pool$getOutput2 = _context4.sent;
              _outputAmount2 = _yield$pool$getOutput2[0];
              amounts[i + 1] = _outputAmount2;

            case 19:
              i++;
              _context4.next = 12;
              break;

            case 22:
              outputAmount = CurrencyAmount.fromFractionalAmount(route.output, amounts[amounts.length - 1].numerator, amounts[amounts.length - 1].denominator);
              _context4.next = 40;
              break;

            case 25:
              !amount.currency.equals(route.output) ? process.env.NODE_ENV !== "production" ? invariant(false, 'OUTPUT') : invariant(false) : void 0;
              outputAmount = CurrencyAmount.fromFractionalAmount(route.output, amount.numerator, amount.denominator);
              amounts[amounts.length - 1] = CurrencyAmount.fromFractionalAmount(route.output.wrapped, amount.numerator, amount.denominator);
              _i2 = route.tokenPath.length - 1;

            case 29:
              if (!(_i2 > 0)) {
                _context4.next = 39;
                break;
              }

              _pool2 = route.pools[_i2 - 1];
              _context4.next = 33;
              return _pool2.getInputAmount(amounts[_i2]);

            case 33:
              _yield$_pool2$getInpu = _context4.sent;
              _inputAmount2 = _yield$_pool2$getInpu[0];
              amounts[_i2 - 1] = _inputAmount2;

            case 36:
              _i2--;
              _context4.next = 29;
              break;

            case 39:
              inputAmount = CurrencyAmount.fromFractionalAmount(route.input, amounts[0].numerator, amounts[0].denominator);

            case 40:
              populatedRoutes.push({
                route: route,
                inputAmount: inputAmount,
                outputAmount: outputAmount
              });

            case 41:
              _context4.next = 2;
              break;

            case 43:
              return _context4.abrupt("return", new Trade({
                routes: populatedRoutes,
                tradeType: tradeType
              }));

            case 44:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    function fromRoutes(_x8, _x9) {
      return _fromRoutes.apply(this, arguments);
    }

    return fromRoutes;
  }()
  /**
   * Creates a trade without computing the result of swapping through the route. Useful when you have simulated the trade
   * elsewhere and do not have any tick data
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @template TTradeType The type of the trade, either exact in or exact out
   * @param constructorArguments The arguments passed to the trade constructor
   * @returns The unchecked trade
   */
  ;

  Trade.createUncheckedTrade = function createUncheckedTrade(constructorArguments) {
    return new Trade(_extends({}, constructorArguments, {
      routes: [{
        inputAmount: constructorArguments.inputAmount,
        outputAmount: constructorArguments.outputAmount,
        route: constructorArguments.route
      }]
    }));
  }
  /**
   * Creates a trade without computing the result of swapping through the routes. Useful when you have simulated the trade
   * elsewhere and do not have any tick data
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @template TTradeType The type of the trade, either exact in or exact out
   * @param constructorArguments The arguments passed to the trade constructor
   * @returns The unchecked trade
   */
  ;

  Trade.createUncheckedTradeWithMultipleRoutes = function createUncheckedTradeWithMultipleRoutes(constructorArguments) {
    return new Trade(constructorArguments);
  }
  /**
   * Get the minimum amount that must be received from this trade for the given slippage tolerance
   * @param slippageTolerance The tolerance of unfavorable slippage from the execution price of this trade
   * @returns The amount out
   */
  ;

  var _proto = Trade.prototype;

  _proto.minimumAmountOut = function minimumAmountOut(slippageTolerance, amountOut) {
    if (amountOut === void 0) {
      amountOut = this.outputAmount;
    }

    !!slippageTolerance.lessThan(ZERO) ? process.env.NODE_ENV !== "production" ? invariant(false, 'SLIPPAGE_TOLERANCE') : invariant(false) : void 0;

    if (this.tradeType === TradeType.EXACT_OUTPUT) {
      return amountOut;
    } else {
      var slippageAdjustedAmountOut = new Fraction(ONE).add(slippageTolerance).invert().multiply(amountOut.quotient).quotient;
      return CurrencyAmount.fromRawAmount(amountOut.currency, slippageAdjustedAmountOut);
    }
  }
  /**
   * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
   * @param slippageTolerance The tolerance of unfavorable slippage from the execution price of this trade
   * @returns The amount in
   */
  ;

  _proto.maximumAmountIn = function maximumAmountIn(slippageTolerance, amountIn) {
    if (amountIn === void 0) {
      amountIn = this.inputAmount;
    }

    !!slippageTolerance.lessThan(ZERO) ? process.env.NODE_ENV !== "production" ? invariant(false, 'SLIPPAGE_TOLERANCE') : invariant(false) : void 0;

    if (this.tradeType === TradeType.EXACT_INPUT) {
      return amountIn;
    } else {
      var slippageAdjustedAmountIn = new Fraction(ONE).add(slippageTolerance).multiply(amountIn.quotient).quotient;
      return CurrencyAmount.fromRawAmount(amountIn.currency, slippageAdjustedAmountIn);
    }
  }
  /**
   * Return the execution price after accounting for slippage tolerance
   * @param slippageTolerance the allowed tolerated slippage
   * @returns The execution price
   */
  ;

  _proto.worstExecutionPrice = function worstExecutionPrice(slippageTolerance) {
    return new Price(this.inputAmount.currency, this.outputAmount.currency, this.maximumAmountIn(slippageTolerance).quotient, this.minimumAmountOut(slippageTolerance).quotient);
  }
  /**
   * Given a list of pools, and a fixed amount in, returns the top `maxNumResults` trades that go from an input token
   * amount to an output token, making at most `maxHops` hops.
   * Note this does not consider aggregation, as routes are linear. It's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pools the pools to consider in finding the best trade
   * @param nextAmountIn exact amount of input currency to spend
   * @param currencyOut the desired currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pool
   * @param currentPools used in recursion; the current list of pools
   * @param currencyAmountIn used in recursion; the original value of the currencyAmountIn parameter
   * @param bestTrades used in recursion; the current list of best trades
   * @returns The exact in trade
   */
  ;

  Trade.bestTradeExactIn =
  /*#__PURE__*/
  function () {
    var _bestTradeExactIn = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee5(pools, currencyAmountIn, currencyOut, _temp, // used in recursion.
    currentPools, nextAmountIn, bestTrades) {
      var _ref5, _ref5$maxNumResults, maxNumResults, _ref5$maxHops, maxHops, amountIn, tokenOut, i, pool, amountOut, _yield$pool$getOutput3, poolsExcludingThisPool;

      return runtime_1.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _ref5 = _temp === void 0 ? {} : _temp, _ref5$maxNumResults = _ref5.maxNumResults, maxNumResults = _ref5$maxNumResults === void 0 ? 3 : _ref5$maxNumResults, _ref5$maxHops = _ref5.maxHops, maxHops = _ref5$maxHops === void 0 ? 3 : _ref5$maxHops;

              if (currentPools === void 0) {
                currentPools = [];
              }

              if (nextAmountIn === void 0) {
                nextAmountIn = currencyAmountIn;
              }

              if (bestTrades === void 0) {
                bestTrades = [];
              }

              !(pools.length > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'POOLS') : invariant(false) : void 0;
              !(maxHops > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'MAX_HOPS') : invariant(false) : void 0;
              !(currencyAmountIn === nextAmountIn || currentPools.length > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'INVALID_RECURSION') : invariant(false) : void 0;
              amountIn = nextAmountIn.wrapped;
              tokenOut = currencyOut.wrapped;
              i = 0;

            case 10:
              if (!(i < pools.length)) {
                _context5.next = 46;
                break;
              }

              pool = pools[i]; // pool irrelevant

              if (!(!pool.token0.equals(amountIn.currency) && !pool.token1.equals(amountIn.currency))) {
                _context5.next = 14;
                break;
              }

              return _context5.abrupt("continue", 43);

            case 14:
              amountOut = void 0;
              _context5.prev = 15;
              _context5.next = 19;
              return pool.getOutputAmount(amountIn);

            case 19:
              _yield$pool$getOutput3 = _context5.sent;
              amountOut = _yield$pool$getOutput3[0];
              _context5.next = 28;
              break;

            case 23:
              _context5.prev = 23;
              _context5.t0 = _context5["catch"](15);

              if (!_context5.t0.isInsufficientInputAmountError) {
                _context5.next = 27;
                break;
              }

              return _context5.abrupt("continue", 43);

            case 27:
              throw _context5.t0;

            case 28:
              if (!(amountOut.currency.isToken && amountOut.currency.equals(tokenOut))) {
                _context5.next = 39;
                break;
              }

              _context5.t1 = sortedInsert;
              _context5.t2 = bestTrades;
              _context5.next = 33;
              return Trade.fromRoute(new Route([].concat(currentPools, [pool]), currencyAmountIn.currency, currencyOut), currencyAmountIn, TradeType.EXACT_INPUT);

            case 33:
              _context5.t3 = _context5.sent;
              _context5.t4 = maxNumResults;
              _context5.t5 = tradeComparator;
              (0, _context5.t1)(_context5.t2, _context5.t3, _context5.t4, _context5.t5);
              _context5.next = 43;
              break;

            case 39:
              if (!(maxHops > 1 && pools.length > 1)) {
                _context5.next = 43;
                break;
              }

              poolsExcludingThisPool = pools.slice(0, i).concat(pools.slice(i + 1, pools.length)); // otherwise, consider all the other paths that lead from this token as long as we have not exceeded maxHops

              _context5.next = 43;
              return Trade.bestTradeExactIn(poolsExcludingThisPool, currencyAmountIn, currencyOut, {
                maxNumResults: maxNumResults,
                maxHops: maxHops - 1
              }, [].concat(currentPools, [pool]), amountOut, bestTrades);

            case 43:
              i++;
              _context5.next = 10;
              break;

            case 46:
              return _context5.abrupt("return", bestTrades);

            case 47:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[15, 23]]);
    }));

    function bestTradeExactIn(_x10, _x11, _x12, _x13, _x14, _x15, _x16) {
      return _bestTradeExactIn.apply(this, arguments);
    }

    return bestTradeExactIn;
  }()
  /**
   * similar to the above method but instead targets a fixed output amount
   * given a list of pools, and a fixed amount out, returns the top `maxNumResults` trades that go from an input token
   * to an output token amount, making at most `maxHops` hops
   * note this does not consider aggregation, as routes are linear. it's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pools the pools to consider in finding the best trade
   * @param currencyIn the currency to spend
   * @param currencyAmountOut the desired currency amount out
   * @param nextAmountOut the exact amount of currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pool
   * @param currentPools used in recursion; the current list of pools
   * @param bestTrades used in recursion; the current list of best trades
   * @returns The exact out trade
   */
  ;

  Trade.bestTradeExactOut =
  /*#__PURE__*/
  function () {
    var _bestTradeExactOut = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee6(pools, currencyIn, currencyAmountOut, _temp2, // used in recursion.
    currentPools, nextAmountOut, bestTrades) {
      var _ref6, _ref6$maxNumResults, maxNumResults, _ref6$maxHops, maxHops, amountOut, tokenIn, i, pool, amountIn, _yield$pool$getInputA, poolsExcludingThisPool;

      return runtime_1.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _ref6 = _temp2 === void 0 ? {} : _temp2, _ref6$maxNumResults = _ref6.maxNumResults, maxNumResults = _ref6$maxNumResults === void 0 ? 3 : _ref6$maxNumResults, _ref6$maxHops = _ref6.maxHops, maxHops = _ref6$maxHops === void 0 ? 3 : _ref6$maxHops;

              if (currentPools === void 0) {
                currentPools = [];
              }

              if (nextAmountOut === void 0) {
                nextAmountOut = currencyAmountOut;
              }

              if (bestTrades === void 0) {
                bestTrades = [];
              }

              !(pools.length > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'POOLS') : invariant(false) : void 0;
              !(maxHops > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'MAX_HOPS') : invariant(false) : void 0;
              !(currencyAmountOut === nextAmountOut || currentPools.length > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'INVALID_RECURSION') : invariant(false) : void 0;
              amountOut = nextAmountOut.wrapped;
              tokenIn = currencyIn.wrapped;
              i = 0;

            case 10:
              if (!(i < pools.length)) {
                _context6.next = 46;
                break;
              }

              pool = pools[i]; // pool irrelevant

              if (!(!pool.token0.equals(amountOut.currency) && !pool.token1.equals(amountOut.currency))) {
                _context6.next = 14;
                break;
              }

              return _context6.abrupt("continue", 43);

            case 14:
              amountIn = void 0;
              _context6.prev = 15;
              _context6.next = 19;
              return pool.getInputAmount(amountOut);

            case 19:
              _yield$pool$getInputA = _context6.sent;
              amountIn = _yield$pool$getInputA[0];
              _context6.next = 28;
              break;

            case 23:
              _context6.prev = 23;
              _context6.t0 = _context6["catch"](15);

              if (!_context6.t0.isInsufficientReservesError) {
                _context6.next = 27;
                break;
              }

              return _context6.abrupt("continue", 43);

            case 27:
              throw _context6.t0;

            case 28:
              if (!amountIn.currency.equals(tokenIn)) {
                _context6.next = 39;
                break;
              }

              _context6.t1 = sortedInsert;
              _context6.t2 = bestTrades;
              _context6.next = 33;
              return Trade.fromRoute(new Route([pool].concat(currentPools), currencyIn, currencyAmountOut.currency), currencyAmountOut, TradeType.EXACT_OUTPUT);

            case 33:
              _context6.t3 = _context6.sent;
              _context6.t4 = maxNumResults;
              _context6.t5 = tradeComparator;
              (0, _context6.t1)(_context6.t2, _context6.t3, _context6.t4, _context6.t5);
              _context6.next = 43;
              break;

            case 39:
              if (!(maxHops > 1 && pools.length > 1)) {
                _context6.next = 43;
                break;
              }

              poolsExcludingThisPool = pools.slice(0, i).concat(pools.slice(i + 1, pools.length)); // otherwise, consider all the other paths that arrive at this token as long as we have not exceeded maxHops

              _context6.next = 43;
              return Trade.bestTradeExactOut(poolsExcludingThisPool, currencyIn, currencyAmountOut, {
                maxNumResults: maxNumResults,
                maxHops: maxHops - 1
              }, [pool].concat(currentPools), amountIn, bestTrades);

            case 43:
              i++;
              _context6.next = 10;
              break;

            case 46:
              return _context6.abrupt("return", bestTrades);

            case 47:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, null, [[15, 23]]);
    }));

    function bestTradeExactOut(_x17, _x18, _x19, _x20, _x21, _x22, _x23) {
      return _bestTradeExactOut.apply(this, arguments);
    }

    return bestTradeExactOut;
  }();

  _createClass(Trade, [{
    key: "route",
    get: function get() {
      !(this.swaps.length == 1) ? process.env.NODE_ENV !== "production" ? invariant(false, 'MULTIPLE_ROUTES') : invariant(false) : void 0;
      return this.swaps[0].route;
    }
    /**
     * The input amount for the trade assuming no slippage.
     */

  }, {
    key: "inputAmount",
    get: function get() {
      if (this._inputAmount) {
        return this._inputAmount;
      }

      var inputCurrency = this.swaps[0].inputAmount.currency;
      var totalInputFromRoutes = this.swaps.map(function (_ref7) {
        var inputAmount = _ref7.inputAmount;
        return inputAmount;
      }).reduce(function (total, cur) {
        return total.add(cur);
      }, CurrencyAmount.fromRawAmount(inputCurrency, 0));
      this._inputAmount = totalInputFromRoutes;
      return this._inputAmount;
    }
    /**
     * The output amount for the trade assuming no slippage.
     */

  }, {
    key: "outputAmount",
    get: function get() {
      if (this._outputAmount) {
        return this._outputAmount;
      }

      var outputCurrency = this.swaps[0].outputAmount.currency;
      var totalOutputFromRoutes = this.swaps.map(function (_ref8) {
        var outputAmount = _ref8.outputAmount;
        return outputAmount;
      }).reduce(function (total, cur) {
        return total.add(cur);
      }, CurrencyAmount.fromRawAmount(outputCurrency, 0));
      this._outputAmount = totalOutputFromRoutes;
      return this._outputAmount;
    }
    /**
     * The price expressed in terms of output amount/input amount.
     */

  }, {
    key: "executionPrice",
    get: function get() {
      var _this$_executionPrice;

      return (_this$_executionPrice = this._executionPrice) != null ? _this$_executionPrice : this._executionPrice = new Price(this.inputAmount.currency, this.outputAmount.currency, this.inputAmount.quotient, this.outputAmount.quotient);
    }
    /**
     * Returns the percent difference between the route's mid price and the price impact
     */

  }, {
    key: "priceImpact",
    get: function get() {
      if (this._priceImpact) {
        return this._priceImpact;
      }

      var spotOutputAmount = CurrencyAmount.fromRawAmount(this.outputAmount.currency, 0);

      for (var _iterator4 = _createForOfIteratorHelperLoose(this.swaps), _step4; !(_step4 = _iterator4()).done;) {
        var _step4$value = _step4.value,
            route = _step4$value.route,
            inputAmount = _step4$value.inputAmount;
        var midPrice = route.midPrice;
        spotOutputAmount = spotOutputAmount.add(midPrice.quote(inputAmount));
      }

      var priceImpact = spotOutputAmount.subtract(this.outputAmount).divide(spotOutputAmount);
      this._priceImpact = new Percent(priceImpact.numerator, priceImpact.denominator);
      return this._priceImpact;
    }
  }]);

  return Trade;
}();

var Multicall = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function Multicall() {}

  Multicall.encodeMulticall = function encodeMulticall(calldatas) {
    if (!Array.isArray(calldatas)) {
      calldatas = [calldatas];
    }

    return calldatas.length === 1 ? calldatas[0] : Multicall.INTERFACE.encodeFunctionData('multicall', [calldatas]);
  };

  return Multicall;
}();
Multicall.INTERFACE = /*#__PURE__*/new Interface(IMulticall.abi);

function isAllowedPermit(permitOptions) {
  return 'nonce' in permitOptions;
}

var SelfPermit = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function SelfPermit() {}

  SelfPermit.encodePermit = function encodePermit(token, options) {
    return isAllowedPermit(options) ? SelfPermit.INTERFACE.encodeFunctionData('selfPermitAllowed', [token.address, toHex(options.nonce), toHex(options.expiry), options.v, options.r, options.s]) : SelfPermit.INTERFACE.encodeFunctionData('selfPermit', [token.address, toHex(options.amount), toHex(options.deadline), options.v, options.r, options.s]);
  };

  return SelfPermit;
}();
SelfPermit.INTERFACE = /*#__PURE__*/new Interface(ISelfPermit.abi);

var Payments = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function Payments() {}

  Payments.encodeFeeBips = function encodeFeeBips(fee) {
    return toHex(fee.multiply(10000).quotient);
  };

  Payments.encodeUnwrapWETH9 = function encodeUnwrapWETH9(amountMinimum, recipient, feeOptions) {
    recipient = validateAndParseAddress(recipient);

    if (!!feeOptions) {
      var feeBips = this.encodeFeeBips(feeOptions.fee);
      var feeRecipient = validateAndParseAddress(feeOptions.recipient);
      return Payments.INTERFACE.encodeFunctionData('unwrapWETH9WithFee', [toHex(amountMinimum), recipient, feeBips, feeRecipient]);
    } else {
      return Payments.INTERFACE.encodeFunctionData('unwrapWETH9', [toHex(amountMinimum), recipient]);
    }
  };

  Payments.encodeSweepToken = function encodeSweepToken(token, amountMinimum, recipient, feeOptions) {
    recipient = validateAndParseAddress(recipient);

    if (!!feeOptions) {
      var feeBips = this.encodeFeeBips(feeOptions.fee);
      var feeRecipient = validateAndParseAddress(feeOptions.recipient);
      return Payments.INTERFACE.encodeFunctionData('sweepTokenWithFee', [token.address, toHex(amountMinimum), recipient, feeBips, feeRecipient]);
    } else {
      return Payments.INTERFACE.encodeFunctionData('sweepToken', [token.address, toHex(amountMinimum), recipient]);
    }
  };

  Payments.encodeRefundETH = function encodeRefundETH() {
    return Payments.INTERFACE.encodeFunctionData('refundETH');
  };

  return Payments;
}();
Payments.INTERFACE = /*#__PURE__*/new Interface(IPeripheryPaymentsWithFee.abi);

var MaxUint128 = /*#__PURE__*/toHex( /*#__PURE__*/JSBI.subtract( /*#__PURE__*/JSBI.exponentiate( /*#__PURE__*/JSBI.BigInt(2), /*#__PURE__*/JSBI.BigInt(128)), /*#__PURE__*/JSBI.BigInt(1))); // type guard

function isMint(options) {
  return Object.keys(options).some(function (k) {
    return k === 'recipient';
  });
}

var NonfungiblePositionManager = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function NonfungiblePositionManager() {}

  NonfungiblePositionManager.encodeCreate = function encodeCreate(pool) {
    return NonfungiblePositionManager.INTERFACE.encodeFunctionData('createAndInitializePoolIfNecessary', [pool.token0.address, pool.token1.address, pool.fee, toHex(pool.sqrtRatioX96)]);
  };

  NonfungiblePositionManager.createCallParameters = function createCallParameters(pool) {
    return {
      calldata: this.encodeCreate(pool),
      value: toHex(0)
    };
  };

  NonfungiblePositionManager.addCallParameters = function addCallParameters(position, options) {
    !JSBI.greaterThan(position.liquidity, ZERO) ? process.env.NODE_ENV !== "production" ? invariant(false, 'ZERO_LIQUIDITY') : invariant(false) : void 0;
    var calldatas = []; // get amounts

    var _position$mintAmounts = position.mintAmounts,
        amount0Desired = _position$mintAmounts.amount0,
        amount1Desired = _position$mintAmounts.amount1; // adjust for slippage

    var minimumAmounts = position.mintAmountsWithSlippage(options.slippageTolerance);
    var amount0Min = toHex(minimumAmounts.amount0);
    var amount1Min = toHex(minimumAmounts.amount1);
    var deadline = toHex(options.deadline); // create pool if needed

    if (isMint(options) && options.createPool) {
      calldatas.push(this.encodeCreate(position.pool));
    } // permits if necessary


    if (options.token0Permit) {
      calldatas.push(SelfPermit.encodePermit(position.pool.token0, options.token0Permit));
    }

    if (options.token1Permit) {
      calldatas.push(SelfPermit.encodePermit(position.pool.token1, options.token1Permit));
    } // mint


    if (isMint(options)) {
      var recipient = validateAndParseAddress(options.recipient);
      calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('mint', [{
        token0: position.pool.token0.address,
        token1: position.pool.token1.address,
        fee: position.pool.fee,
        tickLower: position.tickLower,
        tickUpper: position.tickUpper,
        amount0Desired: toHex(amount0Desired),
        amount1Desired: toHex(amount1Desired),
        amount0Min: amount0Min,
        amount1Min: amount1Min,
        recipient: recipient,
        deadline: deadline
      }]));
    } else {
      // increase
      calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('increaseLiquidity', [{
        tokenId: toHex(options.tokenId),
        amount0Desired: toHex(amount0Desired),
        amount1Desired: toHex(amount1Desired),
        amount0Min: amount0Min,
        amount1Min: amount1Min,
        deadline: deadline
      }]));
    }

    var value = toHex(0);

    if (options.useNative) {
      var wrapped = options.useNative.wrapped;
      !(position.pool.token0.equals(wrapped) || position.pool.token1.equals(wrapped)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'NO_WETH') : invariant(false) : void 0;
      var wrappedValue = position.pool.token0.equals(wrapped) ? amount0Desired : amount1Desired; // we only need to refund if we're actually sending ETH

      if (JSBI.greaterThan(wrappedValue, ZERO)) {
        calldatas.push(Payments.encodeRefundETH());
      }

      value = toHex(wrappedValue);
    }

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: value
    };
  };

  NonfungiblePositionManager.encodeCollect = function encodeCollect(options) {
    var calldatas = [];
    var tokenId = toHex(options.tokenId);
    var involvesETH = options.expectedCurrencyOwed0.currency.isNative || options.expectedCurrencyOwed1.currency.isNative;
    var recipient = validateAndParseAddress(options.recipient); // collect

    calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('collect', [{
      tokenId: tokenId,
      recipient: involvesETH ? ADDRESS_ZERO : recipient,
      amount0Max: MaxUint128,
      amount1Max: MaxUint128
    }]));

    if (involvesETH) {
      var ethAmount = options.expectedCurrencyOwed0.currency.isNative ? options.expectedCurrencyOwed0.quotient : options.expectedCurrencyOwed1.quotient;
      var token = options.expectedCurrencyOwed0.currency.isNative ? options.expectedCurrencyOwed1.currency : options.expectedCurrencyOwed0.currency;
      var tokenAmount = options.expectedCurrencyOwed0.currency.isNative ? options.expectedCurrencyOwed1.quotient : options.expectedCurrencyOwed0.quotient;
      calldatas.push(Payments.encodeUnwrapWETH9(ethAmount, recipient));
      calldatas.push(Payments.encodeSweepToken(token, tokenAmount, recipient));
    }

    return calldatas;
  };

  NonfungiblePositionManager.collectCallParameters = function collectCallParameters(options) {
    var calldatas = NonfungiblePositionManager.encodeCollect(options);
    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0)
    };
  }
  /**
   * Produces the calldata for completely or partially exiting a position
   * @param position The position to exit
   * @param options Additional information necessary for generating the calldata
   * @returns The call parameters
   */
  ;

  NonfungiblePositionManager.removeCallParameters = function removeCallParameters(position, options) {
    var calldatas = [];
    var deadline = toHex(options.deadline);
    var tokenId = toHex(options.tokenId); // construct a partial position with a percentage of liquidity

    var partialPosition = new Position({
      pool: position.pool,
      liquidity: options.liquidityPercentage.multiply(position.liquidity).quotient,
      tickLower: position.tickLower,
      tickUpper: position.tickUpper
    });
    !JSBI.greaterThan(partialPosition.liquidity, ZERO) ? process.env.NODE_ENV !== "production" ? invariant(false, 'ZERO_LIQUIDITY') : invariant(false) : void 0; // slippage-adjusted underlying amounts

    var _partialPosition$burn = partialPosition.burnAmountsWithSlippage(options.slippageTolerance),
        amount0Min = _partialPosition$burn.amount0,
        amount1Min = _partialPosition$burn.amount1;

    if (options.permit) {
      calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('permit', [validateAndParseAddress(options.permit.spender), tokenId, toHex(options.permit.deadline), options.permit.v, options.permit.r, options.permit.s]));
    } // remove liquidity


    calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('decreaseLiquidity', [{
      tokenId: tokenId,
      liquidity: toHex(partialPosition.liquidity),
      amount0Min: toHex(amount0Min),
      amount1Min: toHex(amount1Min),
      deadline: deadline
    }]));

    var _options$collectOptio = options.collectOptions,
        expectedCurrencyOwed0 = _options$collectOptio.expectedCurrencyOwed0,
        expectedCurrencyOwed1 = _options$collectOptio.expectedCurrencyOwed1,
        rest = _objectWithoutPropertiesLoose(_options$collectOptio, ["expectedCurrencyOwed0", "expectedCurrencyOwed1"]);

    calldatas.push.apply(calldatas, NonfungiblePositionManager.encodeCollect(_extends({
      tokenId: toHex(options.tokenId),
      // add the underlying value to the expected currency already owed
      expectedCurrencyOwed0: expectedCurrencyOwed0.add(CurrencyAmount.fromRawAmount(expectedCurrencyOwed0.currency, amount0Min)),
      expectedCurrencyOwed1: expectedCurrencyOwed1.add(CurrencyAmount.fromRawAmount(expectedCurrencyOwed1.currency, amount1Min))
    }, rest)));

    if (options.liquidityPercentage.equalTo(ONE)) {
      if (options.burnToken) {
        calldatas.push(NonfungiblePositionManager.INTERFACE.encodeFunctionData('burn', [tokenId]));
      }
    } else {
      !(options.burnToken !== true) ? process.env.NODE_ENV !== "production" ? invariant(false, 'CANNOT_BURN') : invariant(false) : void 0;
    }

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0)
    };
  };

  NonfungiblePositionManager.safeTransferFromParameters = function safeTransferFromParameters(options) {
    var recipient = validateAndParseAddress(options.recipient);
    var sender = validateAndParseAddress(options.sender);
    var calldata;

    if (options.data) {
      calldata = NonfungiblePositionManager.INTERFACE.encodeFunctionData('safeTransferFrom(address,address,uint256,bytes)', [sender, recipient, toHex(options.tokenId), options.data]);
    } else {
      calldata = NonfungiblePositionManager.INTERFACE.encodeFunctionData('safeTransferFrom(address,address,uint256)', [sender, recipient, toHex(options.tokenId)]);
    }

    return {
      calldata: calldata,
      value: toHex(0)
    };
  };

  return NonfungiblePositionManager;
}();
NonfungiblePositionManager.INTERFACE = /*#__PURE__*/new Interface(INonfungiblePositionManager.abi);

/**
 * Represents the Uniswap V3 QuoterV1 contract with a method for returning the formatted
 * calldata needed to call the quoter contract.
 */

var SwapQuoter = /*#__PURE__*/function () {
  function SwapQuoter() {}

  /**
   * Produces the on-chain method name of the appropriate function within QuoterV2,
   * and the relevant hex encoded parameters.
   * @template TInput The input token, either Ether or an ERC-20
   * @template TOutput The output token, either Ether or an ERC-20
   * @param route The swap route, a list of pools through which a swap can occur
   * @param amount The amount of the quote, either an amount in, or an amount out
   * @param tradeType The trade type, either exact input or exact output
   * @param options The optional params including price limit and Quoter contract switch
   * @returns The formatted calldata
   */
  SwapQuoter.quoteCallParameters = function quoteCallParameters(route, amount, tradeType, options) {
    if (options === void 0) {
      options = {};
    }

    var singleHop = route.pools.length === 1;
    var quoteAmount = toHex(amount.quotient);
    var calldata;
    var swapInterface = options.useQuoterV2 ? this.V2INTERFACE : this.V1INTERFACE;

    if (singleHop) {
      var _options$sqrtPriceLim, _options;

      var baseQuoteParams = {
        tokenIn: route.tokenPath[0].address,
        tokenOut: route.tokenPath[1].address,
        fee: route.pools[0].fee,
        sqrtPriceLimitX96: toHex((_options$sqrtPriceLim = (_options = options) == null ? void 0 : _options.sqrtPriceLimitX96) != null ? _options$sqrtPriceLim : 0)
      };

      var v2QuoteParams = _extends({}, baseQuoteParams, tradeType == TradeType.EXACT_INPUT ? {
        amountIn: quoteAmount
      } : {
        amount: quoteAmount
      });

      var v1QuoteParams = [baseQuoteParams.tokenIn, baseQuoteParams.tokenOut, baseQuoteParams.fee, quoteAmount, baseQuoteParams.sqrtPriceLimitX96];
      var tradeTypeFunctionName = tradeType === TradeType.EXACT_INPUT ? 'quoteExactInputSingle' : 'quoteExactOutputSingle';
      calldata = swapInterface.encodeFunctionData(tradeTypeFunctionName, options.useQuoterV2 ? [v2QuoteParams] : v1QuoteParams);
    } else {
      var _options2;

      !(((_options2 = options) == null ? void 0 : _options2.sqrtPriceLimitX96) === undefined) ? process.env.NODE_ENV !== "production" ? invariant(false, 'MULTIHOP_PRICE_LIMIT') : invariant(false) : void 0;
      var path = encodeRouteToPath(route, tradeType === TradeType.EXACT_OUTPUT);

      var _tradeTypeFunctionName = tradeType === TradeType.EXACT_INPUT ? 'quoteExactInput' : 'quoteExactOutput';

      calldata = swapInterface.encodeFunctionData(_tradeTypeFunctionName, [path, quoteAmount]);
    }

    return {
      calldata: calldata,
      value: toHex(0)
    };
  };

  return SwapQuoter;
}();
SwapQuoter.V1INTERFACE = /*#__PURE__*/new Interface(IQuoter.abi);
SwapQuoter.V2INTERFACE = /*#__PURE__*/new Interface(IQuoterV2.abi);

var Staker = /*#__PURE__*/function () {
  function Staker() {}
  /**
   *  To claim rewards, must unstake and then claim.
   * @param incentiveKey The unique identifier of a staking program.
   * @param options Options for producing the calldata to claim. Can't claim unless you unstake.
   * @returns The calldatas for 'unstakeToken' and 'claimReward'.
   */


  Staker.encodeClaim = function encodeClaim(incentiveKey, options) {
    var _options$amount;

    var calldatas = [];
    calldatas.push(Staker.INTERFACE.encodeFunctionData('unstakeToken', [this._encodeIncentiveKey(incentiveKey), toHex(options.tokenId)]));
    var recipient = validateAndParseAddress(options.recipient);
    var amount = (_options$amount = options.amount) != null ? _options$amount : 0;
    calldatas.push(Staker.INTERFACE.encodeFunctionData('claimReward', [incentiveKey.rewardToken.address, recipient, toHex(amount)]));
    return calldatas;
  }
  /**
   *
   * Note:  A `tokenId` can be staked in many programs but to claim rewards and continue the program you must unstake, claim, and then restake.
   * @param incentiveKeys An IncentiveKey or array of IncentiveKeys that `tokenId` is staked in.
   * Input an array of IncentiveKeys to claim rewards for each program.
   * @param options ClaimOptions to specify tokenId, recipient, and amount wanting to collect.
   * Note that you can only specify one amount and one recipient across the various programs if you are collecting from multiple programs at once.
   * @returns
   */
  ;

  Staker.collectRewards = function collectRewards(incentiveKeys, options) {
    incentiveKeys = Array.isArray(incentiveKeys) ? incentiveKeys : [incentiveKeys];
    var calldatas = [];

    for (var i = 0; i < incentiveKeys.length; i++) {
      // the unique program tokenId is staked in
      var incentiveKey = incentiveKeys[i]; // unstakes and claims for the unique program

      calldatas = calldatas.concat(this.encodeClaim(incentiveKey, options)); // re-stakes the position for the unique program

      calldatas.push(Staker.INTERFACE.encodeFunctionData('stakeToken', [this._encodeIncentiveKey(incentiveKey), toHex(options.tokenId)]));
    }

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0)
    };
  }
  /**
   *
   * @param incentiveKeys A list of incentiveKeys to unstake from. Should include all incentiveKeys (unique staking programs) that `options.tokenId` is staked in.
   * @param withdrawOptions Options for producing claim calldata and withdraw calldata. Can't withdraw without unstaking all programs for `tokenId`.
   * @returns Calldata for unstaking, claiming, and withdrawing.
   */
  ;

  Staker.withdrawToken = function withdrawToken(incentiveKeys, withdrawOptions) {
    var calldatas = [];
    incentiveKeys = Array.isArray(incentiveKeys) ? incentiveKeys : [incentiveKeys];
    var claimOptions = {
      tokenId: withdrawOptions.tokenId,
      recipient: withdrawOptions.recipient,
      amount: withdrawOptions.amount
    };

    for (var i = 0; i < incentiveKeys.length; i++) {
      var incentiveKey = incentiveKeys[i];
      calldatas = calldatas.concat(this.encodeClaim(incentiveKey, claimOptions));
    }

    var owner = validateAndParseAddress(withdrawOptions.owner);
    calldatas.push(Staker.INTERFACE.encodeFunctionData('withdrawToken', [toHex(withdrawOptions.tokenId), owner, withdrawOptions.data ? withdrawOptions.data : toHex(0)]));
    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0)
    };
  }
  /**
   *
   * @param incentiveKeys A single IncentiveKey or array of IncentiveKeys to be encoded and used in the data parameter in `safeTransferFrom`
   * @returns An IncentiveKey as a string
   */
  ;

  Staker.encodeDeposit = function encodeDeposit(incentiveKeys) {
    incentiveKeys = Array.isArray(incentiveKeys) ? incentiveKeys : [incentiveKeys];
    var data;

    if (incentiveKeys.length > 1) {
      var keys = [];

      for (var i = 0; i < incentiveKeys.length; i++) {
        var incentiveKey = incentiveKeys[i];
        keys.push(this._encodeIncentiveKey(incentiveKey));
      }

      data = defaultAbiCoder.encode([Staker.INCENTIVE_KEY_ABI + "[]"], [keys]);
    } else {
      data = defaultAbiCoder.encode([Staker.INCENTIVE_KEY_ABI], [this._encodeIncentiveKey(incentiveKeys[0])]);
    }

    return data;
  }
  /**
   *
   * @param incentiveKey An `IncentiveKey` which represents a unique staking program.
   * @returns An encoded IncentiveKey to be read by ethers
   */
  ;

  Staker._encodeIncentiveKey = function _encodeIncentiveKey(incentiveKey) {
    var _incentiveKey$pool = incentiveKey.pool,
        token0 = _incentiveKey$pool.token0,
        token1 = _incentiveKey$pool.token1,
        fee = _incentiveKey$pool.fee;
    var refundee = validateAndParseAddress(incentiveKey.refundee);
    return {
      rewardToken: incentiveKey.rewardToken.address,
      pool: Pool.getAddress(token0, token1, fee),
      startTime: toHex(incentiveKey.startTime),
      endTime: toHex(incentiveKey.endTime),
      refundee: refundee
    };
  };

  return Staker;
}();
Staker.INTERFACE = /*#__PURE__*/new Interface(IUniswapV3Staker.abi);
Staker.INCENTIVE_KEY_ABI = 'tuple(address rewardToken, address pool, uint256 startTime, uint256 endTime, address refundee)';

/**
 * Represents the Uniswap V3 SwapRouter, and has static methods for helping execute trades.
 */

var SwapRouter = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function SwapRouter() {}
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trade to produce call parameters for
   * @param options options for the call parameters
   */


  SwapRouter.swapCallParameters = function swapCallParameters(trades, options) {
    if (!Array.isArray(trades)) {
      trades = [trades];
    }

    var sampleTrade = trades[0];
    var tokenIn = sampleTrade.inputAmount.currency.wrapped;
    var tokenOut = sampleTrade.outputAmount.currency.wrapped; // All trades should have the same starting and ending token.

    !trades.every(function (trade) {
      return trade.inputAmount.currency.wrapped.equals(tokenIn);
    }) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN_IN_DIFF') : invariant(false) : void 0;
    !trades.every(function (trade) {
      return trade.outputAmount.currency.wrapped.equals(tokenOut);
    }) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN_OUT_DIFF') : invariant(false) : void 0;
    var calldatas = [];
    var ZERO_IN = CurrencyAmount.fromRawAmount(trades[0].inputAmount.currency, 0);
    var ZERO_OUT = CurrencyAmount.fromRawAmount(trades[0].outputAmount.currency, 0);
    var totalAmountOut = trades.reduce(function (sum, trade) {
      return sum.add(trade.minimumAmountOut(options.slippageTolerance));
    }, ZERO_OUT); // flag for whether a refund needs to happen

    var mustRefund = sampleTrade.inputAmount.currency.isNative && sampleTrade.tradeType === TradeType.EXACT_OUTPUT;
    var inputIsNative = sampleTrade.inputAmount.currency.isNative; // flags for whether funds should be send first to the router

    var outputIsNative = sampleTrade.outputAmount.currency.isNative;
    var routerMustCustody = outputIsNative || !!options.fee;
    var totalValue = inputIsNative ? trades.reduce(function (sum, trade) {
      return sum.add(trade.maximumAmountIn(options.slippageTolerance));
    }, ZERO_IN) : ZERO_IN; // encode permit if necessary

    if (options.inputTokenPermit) {
      !sampleTrade.inputAmount.currency.isToken ? process.env.NODE_ENV !== "production" ? invariant(false, 'NON_TOKEN_PERMIT') : invariant(false) : void 0;
      calldatas.push(SelfPermit.encodePermit(sampleTrade.inputAmount.currency, options.inputTokenPermit));
    }

    var recipient = validateAndParseAddress(options.recipient);
    var deadline = toHex(options.deadline);

    for (var _iterator = _createForOfIteratorHelperLoose(trades), _step; !(_step = _iterator()).done;) {
      var trade = _step.value;

      for (var _iterator2 = _createForOfIteratorHelperLoose(trade.swaps), _step2; !(_step2 = _iterator2()).done;) {
        var _step2$value = _step2.value,
            route = _step2$value.route,
            inputAmount = _step2$value.inputAmount,
            outputAmount = _step2$value.outputAmount;
        var amountIn = toHex(trade.maximumAmountIn(options.slippageTolerance, inputAmount).quotient);
        var amountOut = toHex(trade.minimumAmountOut(options.slippageTolerance, outputAmount).quotient); // flag for whether the trade is single hop or not

        var singleHop = route.pools.length === 1;

        if (singleHop) {
          if (trade.tradeType === TradeType.EXACT_INPUT) {
            var _options$sqrtPriceLim;

            var exactInputSingleParams = {
              tokenIn: route.tokenPath[0].address,
              tokenOut: route.tokenPath[1].address,
              fee: route.pools[0].fee,
              recipient: routerMustCustody ? ADDRESS_ZERO : recipient,
              deadline: deadline,
              amountIn: amountIn,
              amountOutMinimum: amountOut,
              sqrtPriceLimitX96: toHex((_options$sqrtPriceLim = options.sqrtPriceLimitX96) != null ? _options$sqrtPriceLim : 0)
            };
            calldatas.push(SwapRouter.INTERFACE.encodeFunctionData('exactInputSingle', [exactInputSingleParams]));
          } else {
            var _options$sqrtPriceLim2;

            var exactOutputSingleParams = {
              tokenIn: route.tokenPath[0].address,
              tokenOut: route.tokenPath[1].address,
              fee: route.pools[0].fee,
              recipient: routerMustCustody ? ADDRESS_ZERO : recipient,
              deadline: deadline,
              amountOut: amountOut,
              amountInMaximum: amountIn,
              sqrtPriceLimitX96: toHex((_options$sqrtPriceLim2 = options.sqrtPriceLimitX96) != null ? _options$sqrtPriceLim2 : 0)
            };
            calldatas.push(SwapRouter.INTERFACE.encodeFunctionData('exactOutputSingle', [exactOutputSingleParams]));
          }
        } else {
          !(options.sqrtPriceLimitX96 === undefined) ? process.env.NODE_ENV !== "production" ? invariant(false, 'MULTIHOP_PRICE_LIMIT') : invariant(false) : void 0;
          var path = encodeRouteToPath(route, trade.tradeType === TradeType.EXACT_OUTPUT);

          if (trade.tradeType === TradeType.EXACT_INPUT) {
            var exactInputParams = {
              path: path,
              recipient: routerMustCustody ? ADDRESS_ZERO : recipient,
              deadline: deadline,
              amountIn: amountIn,
              amountOutMinimum: amountOut
            };
            calldatas.push(SwapRouter.INTERFACE.encodeFunctionData('exactInput', [exactInputParams]));
          } else {
            var exactOutputParams = {
              path: path,
              recipient: routerMustCustody ? ADDRESS_ZERO : recipient,
              deadline: deadline,
              amountOut: amountOut,
              amountInMaximum: amountIn
            };
            calldatas.push(SwapRouter.INTERFACE.encodeFunctionData('exactOutput', [exactOutputParams]));
          }
        }
      }
    } // unwrap


    if (routerMustCustody) {
      if (!!options.fee) {
        if (outputIsNative) {
          calldatas.push(Payments.encodeUnwrapWETH9(totalAmountOut.quotient, recipient, options.fee));
        } else {
          calldatas.push(Payments.encodeSweepToken(sampleTrade.outputAmount.currency.wrapped, totalAmountOut.quotient, recipient, options.fee));
        }
      } else {
        calldatas.push(Payments.encodeUnwrapWETH9(totalAmountOut.quotient, recipient));
      }
    } // refund


    if (mustRefund) {
      calldatas.push(Payments.encodeRefundETH());
    }

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(totalValue.quotient)
    };
  };

  return SwapRouter;
}();
SwapRouter.INTERFACE = /*#__PURE__*/new Interface(ISwapRouter.abi);

export { ADDRESS_ZERO, FACTORY_ADDRESS, FACTORY_ADDRESS_MAP, FeeAmount, FullMath, LiquidityMath, Multicall, NoTickDataProvider, NonfungiblePositionManager, POOL_INIT_CODE_HASH, Payments, Pool, Position, PositionLibrary, Route, SelfPermit, SqrtPriceMath, Staker, SwapMath, SwapQuoter, SwapRouter, TICK_SPACINGS, Tick, TickLibrary, TickList, TickListDataProvider, TickMath, Trade, computePoolAddress, encodeRouteToPath, encodeSqrtRatioX96, isSorted, maxLiquidityForAmounts, mostSignificantBit, nearestUsableTick, priceToClosestTick, subIn256, tickToPrice, toHex, tradeComparator };
//# sourceMappingURL=v3-sdk.esm.js.map
