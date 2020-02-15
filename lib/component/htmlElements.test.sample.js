import {
  a,
  abbr,
  address,
  area,
  article,
  aside,
  audio,
  b,
  bdi,
  bdo,
  blockquote,
  br,
  button,
  canvas,
  caption,
  cite,
  code,
  col,
  colgroup,
  data,
  datalist,
  dd,
  del,
  details,
  dfn,
  dialog,
  div,
  dl,
  dt,
  em,
  embed,
  fieldset,
  figcaption,
  figure,
  footer,
  form,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  header,
  hgroup,
  hr,
  i,
  iframe,
  img,
  input,
  ins,
  kbd,
  label,
  legend,
  li,
  main,
  map,
  mark,
  menu,
  meter,
  nav,
  noscript,
  object,
  ol,
  optgroup,
  option,
  output,
  p,
  param,
  picture,
  pre,
  progress,
  q,
  rb,
  rbc,
  rp,
  rt,
  rtc,
  ruby,
  s,
  samp,
  script,
  section,
  select,
  slot,
  small,
  source,
  span,
  strong,
  sub,
  summary,
  sup,
  table,
  tbody,
  td,
  template,
  textarea,
  tfoot,
  th,
  thead,
  time,
  tr,
  track,
  u,
  ul,
  variable,
  video,
  wbr
} from './htmlElements.js'


export default div(
  header(
    hgroup(
      h1('Test Document'),
      h2('For All HTML5 Tags')),
    nav(
      a({href: '#article1'})('article1'),
      a({href: '#article2'})('article2'))),
  main(
    p('please press', kbd('ctrl'), '+', kbd('shift'), '+', kbd('r'), 'to re-render this page.'),
    section({class: 'articles'})(
      article({id: 'article1'})(
        h1('article1'),
        h2('subtitle'),
        time('2019/01/01 00:00:00'),
        details(
          summary('summary'),
          p(
            'lorem ipsum dolor sit amet,consectetur adipisicing elit. ab accusamus,beatae corporis dolor dolorum,',
            'ducimus,exercitationem harum ipsum maxime molestiae nisi odit praesentium quaerat quasi rerum sapiente sint',
            'tempore tenetur!',
          )
        ),
        h3('paragraph1'),
        figure(
          picture(
            source({srcset: '//placehold.it/400x400', media: '(min-width: 800px)'}),
            img({
              src: '//placehold.it/200x200',
              alt: 'blank image',
              usemap: '#imagemap1',
              width: 200,
              height: 200
            }),
          ),
          map({name: '#imagemap1'})(
            area({alt: 'top left', shape: 'rect', coords: '0,0,100,100', title: 'top left'}),
            area({alt: 'top right', shape: 'rect', coords: '100,0,200,100', title: 'top right'}),
            area({alt: 'bottom left', shape: 'rect', coords: '0,100,100,200', title: 'bottom left'}),
            area({alt: 'bottom right', shape: 'rect', coords: '100,100,200,200', title: 'bottom right'}),
          ),
          figcaption('this is image maps example'),
        ),
        p(
          b('lorem ipsum dolor sit amet'), ',consectetur adipisicing elit.', sup('ab accusamus'), ',beatae',
          'corporis dolor dolorum,ducimus,', abbr('ehim'), 'molestiae nisi odit praesentium quaerat quasi',
          'rerum sapiente sint tempore tenetur!', br,
          'lorem ipsum dolor sit amet,', i('consectetur'), 'adipisicing elit. ab accusamus,', sub('beatae'),
          'corporis dolor dolorum,', 'ducimus,exercitationem harum', del('maxime molestiae nisi'),
          'ipsum odit praesentium', ins('quaerat quasi rerum sapiente'), 'sint tempore tenetur!'
        ),
        aside(
          bdi({class: 'name'})('اَلأَعْشَى'), 'lorem ipsum dolor sit amet,consectetur adipisicing elit. ',
          'aut commodi doloribus exercitationem temporibus voluptas!'),
        h4('heading4'),
        p(
          dfn('lorem ipsum'), 'dolor sit amet,', em('consectetur adipisicing elit'), '. aliquid',
          span('delectus'), 'deleniti error exercitationem harum hic libero nisi nobis quaerat',
          small('quam qui quos sapiente'), ',',
          mark('tempore totam veritatis'), '? ad amet autem modi.',
          bdo({dir: 'rtl'})('this text will go right to left.'),
        ),
        p('when dave asks', strong('hal'), 'to open the pod bay door,hal answers:',
          q({cite: 'https://www.imdb.com/title/tt0062622/quotes/qt0396921'})(`i'm sorry,dave. i'm afraid i can't do that.`),
        ),
        h5('heading5'),
        p(
          u('rolem ipum'), 'dolor sit amet,consectetur adipisicing elit. aliquid delectus deleniti error',
          'exercitationem harum hic libero nisi nobis quaerat quam qui quos sapiente,tempore totam veritatis? ',
          'ad amet autem modi.'),
        h6('heading6'),
        p('fernstraßen',
          wbr, 'bau',
          wbr, 'privat',
          wbr, 'finanzierungs',
          wbr, 'gesetz', br,
          samp('lorem ipsum dolor sit amet,', s('consectetur adipisicing elit'), '. aliquid delectus deleniti error',
            'exercitationem harum hic libero nisi nobis quaerat quam qui quos sapiente,tempore totam veritatis? ad',
            ' amet autem modi.'),
        ),
      ),
      article({id: 'article2'})(
        h1('article2'),
        h2('subtitle'),
        blockquote(
          p('it was a bright cold day in april,and the clocks were striking thirteen.'),
          footer('first sentence in', cite(a({href: 'http://www.george-orwell.org/1984/0.html'})(
            i('nineteen eighty-four'))), 'by george _.orwell (part 1,chapter 1).'),
        ),
        hr,
        h3('ruby'),
        ruby({xml: 'lang:"en"'})(
          rbc(
            rb('馬'), rp('('), rt('mǎ'), rp(')'),
            rb('來'), rp('('), rt('lái'), rp(')'),
            rb('西'), rp('('), rt('xī'), rp(')'),
            rb('亞'), rp('('), rt('yà'), rp(')'),
          ),
          rtc({xml: 'lang:"en"'})(
            rp('('), rt('malaysia'), rp(')'),
          ),
        ),
        hr,
        h3('code'),
        dl(
          dt(variable('hello')),
          dd(
            menu(
              li(data({value: 'hello'})('hello')),
              li(data({value: '안녕'})('안녕')),
            ),
          ),
          dt(variable('world')),
          dd(
            menu(
              li(data({value: 'world'})('world')),
              li(data({value: '세상아'})('세상아')),
            ),
          ),
        ),
        pre(code(`
'use strict';
const hello = 'hello';
const world = 'world';
function helloworld{ 
    console._.log(\'\${ _.hello({  },\${ _.world({  }!\');
 }`
        )),
        hr,
        h3('lists'),
        h4('ordered'),
        ol(
          li('item1'),
          li('item2'),
          li('item3'),
        ),
        h4('unordered'),
        ul(
          li('item1'),
          li('item2'),
          li('item3'),
        ),
        hr,
        h3('table'),
        table(
          caption('sample table'),
          colgroup(
            col({class: 'col-header'}), col({class: 'group1', span: 2}), col({
              class: 'group2',
              span: 2
            }),
          ),
          tbody(
            tr(th('row1'), td('-'), td('-'), td('-'), td('-')),
            tr(th('row1'), td('-'), td('-'), td('-'), td('-')),
          ),
          thead(
            tr(th, th('col1'), th('col2'), th('col3'), th('col4')),
            tr,
          ),
          tfoot(
            tr(th('summary'), td('-'), td('-'), td('-'), td('-')),
          ),
        ),
        hr,
        h3('multimedia'),
        audio({src: 'foo.ogg', controls: ''})(
          track({kind: 'captions', src: 'foo.en.vtt', srclang: 'en', label: 'english'}),
          track({kind: 'captions', src: 'foo.sv.vtt', srclang: 'sv', label: 'svenska'}),
        ),
        br,
        video({controls: '', width: 250})(
          source({src: 'sample.webm', type: 'video/webm'}),
          source({
            src: 'sample.mp4',
            type: 'video/mp4'
          }), `sorry,your browser doesn't support embedded videos.`),
        hr,
        h3('embedded content'),
        iframe({src: '//www.example.com'}),
        embed,
        object(
          param({name: '', value: ''}),
        ),
        hr,
        h3('canvas'),
        canvas({id: 'canvas', width: 150, height: 150})('canvas example'),
        noscript('cannot run a script for a canvas'),
        script({type: 'application/javascript'})(`
const ctx = document._.getelementbyid('canvas')._.getcontext('2d')
ctx.fillstyle = '_.rgb(200,0,0)'
ctx._.fillrect(10,10,50,50)
ctx.fillstyle = '_.rgba(0,0,200,0.5)'
ctx._.fillrect(30,30,50,50)
        `),
        hr,
        h3('form'),
        form(
          meter({value: 1, max: 5}), '1/5',
          fieldset(
            legend('sample form'),
            br,
            label('input',
              input({type: 'text'}),
            ),
            br,
            label('select',
              select(
                optgroup({label: 'group1'})(
                  option({value: 1, selected: 'selected'})('option1'),
                  option({value: 2})('option2'),
                ),
                optgroup({label: 'group2'})(
                  option({value: 3})('option3'),
                  option({value: 4})('option4'),
                ),
              ),
            ),
            br,
            datalist(
              option({value: 'data1'})(),
              option({value: 'data2'})(),
              option({value: 'data3'})(),
            ),
            br,
            label(
              'textarea', br,
              textarea,
            ),
          ),
          output('sample output'), br,
          progress({max: 10, value: 5})('50%'), br,
          button('ok'),
        ),
        hr,
        h3('dialog'),
        dialog({open: ''})('hello world!'),
      ),
    ),
  ),
  footer(
    hr,
    address('cecilia chapman', br, '711-2880 nulla st.', br, 'mankato mississippi 96522', br, '(257) 563-7401'),
  ),
  template({id: 'template1'})(
    'this is',
    slot({name: 'slot1'})('sample'),
    'template'
  ),
)

