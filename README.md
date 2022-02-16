<table>
  <tr>
    <td>
      <img src="https://phunanon.github.io/Insitux/media/insitux.png" alt="Insitux logo" height="32">
    </td>
    <td colspan="3">
      Extensible scripting language written in portable TypeScript.
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://phunanon.github.io/Insitux">Website</a>
    </td>
    <td>
      <a href="https://phunanon.github.io/Insitux/website/repl">Try online</a>
    </td>
    <td>
      <a href="https://discord.gg/w3Fc4YZ9Qw">
        Talk with us
        <img src="https://phunanon.github.io/Insitux/website/DiscordLogo.png" alt="Discord logo" height="16">
      </a>
    </td>
  </tr>
</table>

- [Main Github repository](https://github.com/phunanon/Insitux) - learn everything else about Insitux here
- [Roblox-ts NPM package](https://www.npmjs.com/package/@rbxts/insitux) and its [Github repository](https://github.com/insitux/rbxts-Insitux).

## Usage

Include https://github.com/insitux/rbxts-Insitux into your roblox-ts project: `npm i @rbxts/insitux`

Exposed are `invoke()` and `invokeFunction()`. Both require a `Ctx` instance, along with a generated source ID.  
Further explanation can be found in the docstring of most functions and types like `invoke`, `Ctx`, `symbols`, etc.

```ts
export type Ctx = {
  set: (key: string, val: Val) => undefined | string;
  get: (key: string) => ValOrErr;
  exe: (name: string, args: Val[]) => ValOrErr;
  functions: ExternalFunction[];
  print: (str: string, withNewline: boolean) => void;
  env: Env;
  loopBudget: number;
  rangeBudget: number;
  callBudget: number;
  recurBudget: number;
};
```

- `set` and `get` should be used to directly write/read values in your game.  
- `functions` lets you define your own Insitux functions, with the same arity and type-checking as internal operations!  
- `exe` is used to handle function calls any time
Insitux fails to dereference an expression head as something internal or
previously defined through `Ctx.functions[]`. For example `(abc 123)`, unless
`abc` is an already defined let/var/function it will call `exe` with `abc` as
`name`, and `[{t: "num" v: 123}]` as `args`.  
- `print` is called when `print` or `print-str` is used within Insitux
- `env` persists user defined variables and functions.
- The budgets set a limit on looping, range creation, function calls and
explicit recurs. This will vary between games so start with a safe `1000` and
increase steadily.

If anybody could improve this guide please make a PR!


## Various examples

```clj
; Test if 2D point is inside 2D area
(function inside-2d? X Y areaX areaY areaW areaH
  (and (<= areaX X (+ areaX areaW))
       (<= areaY Y (+ areaY areaH))))

(inside-2d? 50 50 0 0 100 100)  → true
(inside-2d? 50 150 0 0 100 100) → false


; Recursive Fibonacci solver
(function fib n
  (if (< n 2) n
      (+ (fib (dec n))
         (fib (- n 2)))))

(fib 13) → 233


; FizzBuzz with match syntax
(function fizzbuzz n
  (match (map (rem n) [3 5])
    [0 0] "FizzBuzz"
    [0 _] "Fizz"
    [_ 0] "Buzz"
    n))

(map fizzbuzz (range 10 16))
→ ["Buzz" 11 "Fizz" 13 14 "FizzBuzz"]


; Filter for vectors and strings above a certain length
(filter 2 [[1] [:a :b :c] "hello" "hi"])
→ [[:a :b :c] "hello"]


; Flatten a vector one level deep
(.. .. vec [[0 1] 2 3 [4 5]])
→ [0 1 2 3 4 5]


; Triple every vector item, four different ways
(for * [0 1 2 3 4] [3])
(map #(* 3 %) [0 1 2 3 4])
(map @(* 3) [0 1 2 3 4])
(map (* 3) [0 1 2 3 4])
→ [0 3 6 9 12]


; Primes calculator
(reduce
  (fn primes num
    (if (find zero? (map (rem num) primes))
      primes
      (push primes num)))
  [2]
  (range 3 1000))


; Generate random strong password
(-> (fn a b (repeat #(char-code (rand-int a b)) 4))
   #(map % [97 65 48 33] [123 91 58 48])
   @(.. .. vec)
   #(sort % #(rand-int))
    (.. str))

→ "d$W1iP*tO9'V9(y8"


; Palindrome checker
;Note: returning non-false or non-null is truthy in Insitux
(function palindrome? x
  (.. and (map = x (reverse x))))
;or
(function palindrome? x
  (= x (reverse x))) ;Works even for vectors due to deep equality checks

(palindrome? "aabbxbbaa") → "aabbxbbaa"
(palindrome? "abcd")      → false
(palindrome? [0 1 2])     → false
(palindrome? [2 1 2])     → [2 1 2]


; Matrix addition
(let A [[3  8] [4  6]]
     B [[4  0] [1 -9]])

(map (map +) A B)
→ [[7 8] [5 -3]]


; Matrix negation
(let M [[2 -4] [7 10]])

(map (map -) M)
→ [[-2 4] [-7 -10]]


; Clojure's juxt
(function juxt
  (let funcs args)
  #(for ... funcs [args]))

((juxt + - * /) 10 8)
→ [18 2 80 1.25]


; Clojure's comp
(function comp f
  (let funcs (sect args))
  #(do (let 1st (.. f args))
       (reduce #(%1 %) 1st funcs)))

(map (comp + inc) [0 1 2 3 4] [0 1 2 3 4])
→ [1 3 5 7 9]


; Clojure's frequencies
(function frequencies list
  (reduce #(push % %1 (inc (or (% %1) 0))) {} list))

(frequencies "hello")
→ {"h" 1, "e" 1, "l" 2, "o" 1}


; Deduplicate a list recursively
(function dedupe list -out
  (let out  (or -out [])
       next (if (out (0 list)) [] [(0 list)]))
  (if (empty? list) out
    (recur (sect list) (into out next))))
;or via dictionary keys
(function dedupe list
  (keys (.. .. dict (for vec list [0]))))
;or via reduction
(function dedupe list
  (reduce #(if (% %1) % (push % %1)) [] list))

(dedupe [1 2 3 3])
→ [1 2 3]


; Time a function call
(function measure
  (let [start result end] [(time) (.. . args) (time)])
  (str result " took " (- end start) "ms"))

(measure fib 35)
→ "9227465 took 38003ms"


; Display the Mandelbrot fractal as ASCII
(function mandelbrot width height depth
  (.. str (for #(do
    (let c_re (/ (* (- % (/ width 2)) 4) width)
         c_im (/ (* (- %1 (/ height 2)) 4) width))
    (let x 0 y 0 i 0)
    (while (and (<= (+ (** x) (** y)) 4)
                (< i depth))
      (let x2 (+ c_re (- (** x) (** y)))
           y  (+ c_im (* 2 x y))
           x  x2
           i  (inc i)))
    (str ((zero? %) "\n" "") (i "ABCDEFGHIJ ")))
    (range width) (range height))))

(mandelbrot 56 32 10)


; Convert nested arrays and dictionaries into HTML
(function vec->html v
  (if! (vec? v) (return v))
  (let [tag attr] v
       has-attr   (dict? attr)
       make-attr  (fn [k v] (str " " k "=\"" v "\""))
       attr       (if has-attr (map make-attr attr) "")
       tag        (-> tag str sect)
       body       (sect v (has-attr 2 1))
       body       (map vec->html body))
  (.. str "<" tag attr ">" body "</" tag ">"))

(vec->html
  [:div
    [:h2 "Hello"]
    [:p ".PI is " [:b (round 2 PI)] "."]
    [:p "Find more about Insitux on "
       [:a {"href" "https://github.com/phunanon/Insitux"}
          "Github"]]])
→ "<div><h2>Hello</h2><p>.PI is <b>3.14</b>.</p><p>Find more about Insitux on <a href="https://github.com/phunanon/Insitux">Github</a></p></div>"


; Neural network for genetic algorithms with two hidden layers
(function sigmoid (/ 1 (inc (** E (- %)))))
(function m (< .8 (rand)))

(function make-brain  num-in num-out num-hid
  (let make-neuron #{:bias 0 :weights (repeat 1 %)})
  [(repeat #(make-neuron num-in) num-hid)
   (repeat #(make-neuron num-hid) num-hid)
   (repeat #(make-neuron num-hid) num-out)])

(function mutate  brain
  (let mutate-neuron
    #{:bias    ((m) (rand -2 2) (:bias %))
      :weights (map @((m) (rand -1 1)) (:weights %))})
  (map (map mutate-neuron) brain))

(function neuron-think  neuron inputs
  (let weighted (map * (:weights neuron) inputs)
       average  (/ (.. + weighted) (len inputs)))
  (sigmoid (+ average (:bias neuron))))

(function think  brain inputs
  (let thoughts (map #(neuron-think % inputs)   (0 brain))
       thoughts (map #(neuron-think % thoughts) (1 brain))
       thoughts (map #(neuron-think % thoughts) (2 brain))))

(var brain (mutate (make-brain 5 5 5)))
(-> (repeat #(rand-int) 5)
   @(think brain)
    (map @(round 2)))
→ [0.23 0.41 0.63 0.64 0.57]
```
