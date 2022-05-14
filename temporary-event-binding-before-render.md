# note

```TypeScript
document.getElementById("app").innerHTML = `
<h1>Hello Vanilla!</h1>
<div>
  We use the same configuration as Parcel to bundle this sandbox, you can find more
  info about Parcel 
  <a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>.
</div>
<div id="rroot">
  <div class="children">children</div>
  <div class="children">children</div>
  <div class="children">children</div>
  <div class="children">children</div>
  <div class="children">children</div>
</div>
`;

const template: HTMLTemplateElement = document.createElement('template');

const templateGenerator = (): string => {
  return `
    <div class="container">
      <h4>HOGE</h4>
      <input class="input" />
    </div>
  `;
};

template.innerHTML = templateGenerator();
const input = template.content.querySelector<HTMLInputElement>('input');
if(input) {
  input.addEventListener("change", () => {
    console.log(input.value);
  })
}
else {
  console.log("input cannot acquired");
}

// const parent = document.querySelector(".rroot");
const parent = document.getElementById('rroot');
if(parent){
  // Element.appendはElementの一番最後の子要素として挿入する
  // parent.append(template.content)
  // 上記と同様
  // parent.insertBefore(template.content, null);
  // parentの一番初めの子要素として挿入される
  parent.prepend(template.content)
}
else {
  console.log("rroot cannot acquired");
}
```
