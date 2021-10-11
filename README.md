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

```ts
export type Ctx = {
  set: (key: string, val: Val) => Promise<ExternalError>;
  get: (key: string) => Promise<ValAndErr>;
  exe: (name: string, args: Val[]) => Promise<ValAndErr>;
  env: Env;
  loopBudget: number;
  rangeBudget: number;
  callBudget: number;
  recurBudget: number;
};
```

- `set` and `get` should be used to directly write/read values in your game.  
- `exe` is used to extend Insitux with custom functions. This is called any time
Insitux fails to dereference an expression head as something internal. For
example `(abc 123)`, unless `abc` is an already defined let/var/function it will
call `exe` with `abc` as `name`, and `[{t: "num" v: 123}]` as `args`.  
  - Insitux expects you have handled `print` and `print-str`.
- `env` persists user defined variables and functions.
- The budgets set a limit on looping, range creation, function calls and
explicit recurs. This will vary between games so start with a safe `1000` and
increase steadily.

If anybody could improve this guide please make a PR!


## Various examples

```clj
; Test if 2D coordinate are inside 2D area
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


; Filter for vectors and strings above a certain length
(filter 2 [[1] [:a :b :c] "hello" "hi"])
→ [[:a :b :c] "hello"]


; Flatten a vector one level deep
(.. .. vec [[0 1] 2 3 [4 5]])
→ [0 1 2 3 4 5]


; Triple every vector item
(for * [0 1 2 3 4] [3])
;or
(map @(* 3) [0 1 2 3 4])
→ [0 3 6 9 12]


; Palindrome checker
(function palindrome? text
  (.. and (map = text (reverse text))))

(palindrome? "aabbxbbaa") → true
(palindrome? "abcd")      → false


; Clojure's juxt
(function juxt
  (let funcs args)
  #(for #(.. %1 %) [args] funcs))

((juxt + - * /) 10 8)
→ [18 2 80 1.25]


; Clojure's comp
(function comp f
  (let funcs (sect args))
  #(do (let 1st (.. f args))
       (reduce #(%1 %) funcs 1st)))

(map (comp + inc) [0 1 2 3 4] [0 1 2 3 4])
→ [1 3 5 7 9]


; Clojure's frequencies
(function frequencies list
  (reduce #(push % %1 (inc (or (% %1) 0))) list {}))

(frequencies "hello")
→ {"h" 1, "e" 1, "l" 2, "o" 1}


; Deduplicate a list recursively
(function dedupe list -out
  (let out  (or -out [])
       next (if (out (0 list)) [] [(0 list)]))
  (if (empty? list) out
    (recur (sect list) (into out next))))
;or deduplicate a list via dictionary keys
(function dedupe list
  (keys (.. .. dict (for vec list [0]))))

(dedupe [1 2 3 3])
→ [1 2 3]


; Time a function call
(function measure
  (let report [(time) (.. .. args) (time)])
  (str (1 report) " took " (- (2 report) (0 report)) "ms"))

(measure fib 35) → "9227465 took 45500ms"


; Display the Mandelbrot fractal as ASCII
(function mandelbrot width height depth
  (.. str (for #(do
    (let c_re (/ (* (- % (/ width 2)) 4) width)
         c_im (/ (* (- %1 (/ height 2)) 4) width))
    (let x 0 y 0 i 0)
    (while (and (<= (+ (** x) (** y)) 4)
                (< i depth))
      (let x2 (+ (- (** x) (** y)) c_re)
           y  (+ (* 2 x y) c_im)
           x  x2
           i  (inc i)))
    (str (if (zero? %) "\n" "") (if (< i depth) "#" " ")))
    (range width) (range height))))

(mandelbrot 48 32 10)


; Convert nested arrays and dictionaries into HTML
(function vec->html v
  (if (vec? v)
    (let has-attr (dict? (1 v))
         attr (if has-attr (map #(str " " (0 %) "=\"" (1 %)) (1 v)) "")
         tag (0 v)
         html (.. str "<" tag attr ">"
                (map vec->html (sect v (if has-attr 2 1)))
                "</" tag ">"))
    v))

(vec->html
  ["div"
    ["h2" "Hello"]
    ["p" ".PI is " ["b" PI] "."]
    ["p" "Find more info about Insitux on "
       ["a" {"href" "https://github.com/phunanon/Insitux"}
          "Github"]]])
```
