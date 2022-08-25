# frameworkless-frontend

### 목차

[chapter2 - 렌더링](#렌더링)  
[chapter3 - DOM 이벤트 관리](#dom-이벤트-관리)  
[chapter4 - web component](#4-web-component)  
[chapter5 - http 요청](#5-http-요청)  
[chapter6 - 라우팅](#6-라우팅)  
[chapter7 - 상태 관리](#7-상태-관리)  
<br>

## 2. 렌더링

### 렌더링 함수

```ts
view = f(state);
```

DOM 요소가 애플리케이션의 상태에만 의존하도록 하기 위해서, 순수 함수로 요소를 렌더링하도록 작성하였다.  
`requestAnimationFrame`을 기반으로 작성하였고, `repaint`가 이벤트 루프에서 스케줄링 되기 직전에 callback이 실행되기 때문에 효율적으로 DOM을 조작할 수 있다.  
<br>

### Component 함수

[data-attributes](https://developer.mozilla.org/ko/docs/Learn/HTML/Howto/Use_data_attributes)를 사용하여 component의 이름을 넣었다.(data-component)  
component registry를 이용하여, data-component의 속성 값과 일치하는 렌더링 함수를 사용하도록 한다.

```ts
const registry = {
  todos: todosView,
  counter: counterView,
  filters: filtersView,
};
```

추가로, root component에서 하위 모든 component의 data-component의 속성 값을 읽고, 재귀적으로 렌더링을 수행하도록 개선하자.  
렌더링 함수를 순수 함수로 작성하였기 때문에 [렌더링 함수를 래핑하는 고차함수(HOC)](https://github.com/iamsungjinkim/frameworkless-frontend/blob/master/src/chapter/2-3/registry/index.ts#L21)를 사용한다.  
<br>

### 가상 DOM

기존의 DOM과 새롭게 렌더링된 DOM을 통째로 교체하는 방식은 큰 프로젝트에서 성능을 저하시킬 수 있다.  
간단히 `reconciliation`을 구현해보자. [코드](https://github.com/iamsungjinkim/frameworkless-frontend/blob/master/src/chapter/2-3/utils/applyDiff.ts)

```mermaid
flowchart LR
A(애플리케이션) --> B(가상 DOM 노드) --> C(diff 알고리즘) --> D(실제 DOM)
```

- 속성 수가 다르다.
- 하나 이상의 속성이 변경됐다.
- 노드에 자식이 없으며, textContent가 다르다.

위의 조건으로 간단히 diff 알고리즘을 구현하였다.

> ✅ 추가로 알고리즘을 개선해볼만한 부분.
>
> ```html
> // before
> <div>
>   before text
>   <ul>
>     <li>리스트1</li>
>     <li>리스트2</li>
>   </ul>
> </div>
>
> // after
> <div>
>   after text
>   <ul>
>     <li>리스트1</li>
>     <li>리스트2</li>
>   </ul>
> </div>
> ```
>
> - [`Element.childNodes`](https://developer.mozilla.org/ko/docs/Web/API/Node/childNodes)
> - [`Node.nodeType`](https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType)

<br>

## 3. DOM 이벤트 관리

이벤트의 등록은 [`EventTarget.addEventListener`](https://developer.mozilla.org/ko/docs/Web/API/EventTarget/addEventListener)를 이용한다.

> ❗️ DOM에 요소가 더이상 존재하지 않으면 메모리 누수를 방지하기 위하여 [`EventTarget.removeEventListener`](https://developer.mozilla.org/ko/docs/Web/API/EventTarget/addEventListener)를 사용해서 이벤트를 제거해줘야 한다.

렌더링 함수(view)의 인터페이스를 수정하여 events를 추가해주고, eventListener를 부착해준다.

```ts
// index.ts
const events = {
  deleteItem: (index: number) => {
    state.todos.splice(index, 1);
    render();
  },
  addItem: (text: string) => {
    state.todos.push({
      text,
      completed: false,
    });
    render();
  },
};

const render = () => {
  window.requestAnimationFrame(() => {
    const main = document.querySelector("#root");
    const newMain = registry.renderRoot(main, state, events);

    applyDiff(document.body, main, newMain);
  });
};
```

### 이벤트 위임

`data attributes`와 `event bubbling`을 이용하여 이벤트 위임을 적용한다.

```ts
// view/todos.ts
const getTodoElement = (todo, index) => {
  // ...
  element.querySelector("button.destroy").dataset.index = index;

  return element;
};

export default (targetElement, state, events) => {
  // ...
  newTodoList.addEventListener("click", (e) => {
    if (e.target.matches("button.bestroy")) {
      events.deleteItem(e.target.dataset.index);
    }
  });

  return newTodoList;
};
```

> ❗️ 이벤트 핸들러가 부착된 요소는 `non-fast scrollable region`으로 표시되기 때문에, 이벤트 위임 패턴을 사용할때 주의해야 한다. [참고](https://d2.naver.com/helloworld/6204533)

<br>

## 4. Web Component

### API

1. HTML Template
2. Custom Elements ✅
3. Shadow DOM

### Custom Elements

- `connectedCallback`: react의 componentDidMount와 유사하다.
- `disconnectedCallback`: react의 componentWillUnmount와 유사하다.
- `attributeChangedCallback`: 속성 중 하나가 추가,제거,변경될 때마다 호출된다. `static get observedAttributes`에 명시된 속성의 변경만 트리거한다.

표준 요소에 속성을 설정하는 방법 3가지

```ts
<input type="text" value="Frameworkless" />;

input.value = "Frameworkless";

input.setAttribute("value", "Frameworkless");
```

표준 요소의 속성을 설정하는 방법과 동기화 시켜주기 위해 `getter`,`setter`를 활용할 수 있다.

```ts
const DEFAULT_COLOR = "black";

export default class Helloworld extends HTMLElement {
  static get observedAttributes() {
    return ["color"];
  }

  get color() {
    return this.getAttribute("color") || DEfAULT_COLOR;
  }

  set color(value) {
    this.setAttribute("color", value);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.div) return;

    if (name === "color") {
      this.div.style.color = newValue;
    }
  }

  connectedCallback() {
    window.requestAnimationFrame(() => {
      this.div = document.createElement("div");
      this.div.textContent = "Hello World!";
      this.div.style.color = this.color;
      this.appendChild(this.div);
    });
  }
}

window.customElements.define("hello-world", HelloWorld);
```

```html
<hello-world></hello-world>

<hello-world color="red"></hello-world>
```

여기에 가상 DOM을 적용하면 아래와 같이 사용이 가능하다.

```ts
const createDomElement = (color: string) => {
  const div = document.createElement("div");

  div.textContent = "Hello World!";
  div.style.color = color;

  return div;
};

export default class Helloworld extends HTMLElement {
  // ...
  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.hasChildNodes()) return;

    applyDiff(this, this.firstElementChild, createDomElement(newValue));
  }

  connectedCallback() {
    window.requestAnimationFrame(() => {
      this.appendChild(createDomElement(this.color));
    });
  }
}
```

<br>

## 5. HTTP 요청

- XMLHttpRequest
- Fetch
- axios

```mermaid
flowchart LR
A[Fetch]
B[XHR]
C[axios]
D['interface'\n HTTPClient]
E[model]
A-->D
B-->D
C-->D
D---E
```

> 구현이 아닌 인터페이스로 프로그래밍하라. - 갱 오브 포(Gang of Four)

또한 컨트롤러에서 직접 HTTP 클라이언트를 사용하는 것 보다, 모델 객체에 래핑하는 것의 장점이 있다. (ex: Todos model)

1. 테스트 가능성: 모델 객체를 fixture를 반환하는 mock으로 바꿀 수 있어서, 컨트롤러를 독립적으로 테스트할 수 있다.
2. 가독성: 모델 객체는 코드를 더 명확히 만든다.

<br>

## 6. 라우팅

### 6-1. Fragment identifiers 기반

```ts
router
  .addRoutes("#/", pages.home)
  .addRoutes("#/list", pages.list)
  .addRoutes("#/list/:id", pages.detail)
  .addRoutes("#/list/:id/:anotherId", pages.anotherDetail);
```

location hash를 이용하는 방식으로, 각 hash에 해당하는 컴포넌트를 등록해 놓고 eventListener로 컨테이너 컴포넌트를 바꿔주는 방식이다.  
`Dynamic Route`를 위해서 route를 등록하는 시점에 정규표현식을 이용하여 처리를 해주면 된다.

```ts
// input: #/list/:id/:anotherId
{
  testRegex: '^#\/list\/([^\\/]+)\/([^\\/]+)$',
  paramNames: ['id', 'anotherId'],
}
```

`#/list/:id/:anotherId`의 경우, 위와 같은 데이터 형태로 변환하여 컴포넌트와 함께 저장한다.  
이후 hash를 검사하는 부분에서 위의 데이터를 이용하여 일치하는 컴포넌트를 확인하고 `paramName`과 값을 추출하여 컴포넌트를 렌더링한다.

[자세한 변환 과정](https://github.com/iamsungjinkim/frameworkless-frontend/blob/master/src/chapter/6/router.ts#L54)은 코드로 확인할 수 있고, 그 과정에서 사용한 `replace`의 두번째 인자로 함수를 전달하는 방법과 해당 함수(replacement)가 받는 인자에 대해서는 [MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/replace#%EB%A7%A4%EA%B0%9C%EB%B3%80%EC%88%98%EA%B0%80_function%EC%9C%BC%EB%A1%9C_%EC%A7%80%EC%A0%95%EB%90%98%EC%97%88%EC%9D%84_%EB%95%8C) 문서를 참고한다.

### 6-2 History API 기반

`Fragment identifiers`방식과 매우 유사하다.  
대신 hash가 아닌 `http://localhost:3000/list/1/2`와 같은 실제 URL을 사용한다. `vite`를 사용한 multi-page app으로 구조를 작성하는 관계로 `http://localhost:3000/chapter/6/list/1/2`과 같은 URL로 사용하였다.

hash를 사용하는 방식에서는 `hashchange`이벤트를 받아서 라우팅을 해줬으나, URL의 변경을 받을 DOM 이벤트가 없어서 `setInterval`을 사용하여 정기적으로 라우팅 체크를 해줬다.  
URL의 변경은 `history.pushState`를 사용하였고, 네비게이션 버튼으로 `<a>`태그를 사용하였다.  
`history.pushState(null, '', a.href)`와 같은 방식으로 URL을 변경해주면 된다.

<br>

## 7. 상태 관리
