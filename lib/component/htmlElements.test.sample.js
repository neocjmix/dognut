import {
  A,
  Address,
  Area,
  Article,
  Aside,
  Audio,
  B,
  Bdi,
  Bdo,
  Blockquote,
  Br,
  Button,
  Canvas,
  Caption,
  Cite,
  Code,
  Col,
  Colgroup,
  Data,
  Datalist,
  Dd,
  Del,
  Details,
  Dfn,
  Dialog,
  Div,
  Dl,
  Dt,
  Em,
  Fieldset,
  Figcaption,
  Figure,
  Footer,
  Form,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Header,
  Hgroup,
  Hr,
  I,
  Iframe,
  Img,
  Input,
  Ins,
  Kbd,
  Label,
  Legend,
  Li,
  Main,
  Map,
  Mark,
  Menu,
  Meter,
  Nav,
  Noscript,
  Object,
  Ol,
  Optgroup,
  Option,
  Output,
  P,
  Param,
  Picture,
  Pre,
  Progress,
  Q,
  Rb,
  Rbc,
  Rp,
  Rt,
  Rtc,
  Ruby,
  S,
  Samp,
  Script,
  Section,
  Select,
  Slot,
  Small,
  Source,
  Span,
  Strong,
  Sub,
  Summary,
  Sup,
  Table,
  Tbody,
  Td,
  Template,
  Textarea,
  Tfoot,
  Th,
  Thead,
  Time,
  Tr,
  Track,
  U,
  Ul,
  Variable,
  Video
} from './htmlElements.js'


export default Div(
  Header(
    Hgroup(
      H1('Test Document'),
      H2('For All HTML5 Tags')),
    Nav(
      A({href: '#article1'})('article1'),
      A({href: '#article2'})('article2'))),
  Main(
    P('please press', Kbd('ctrl'), '+', Kbd('shift'), '+', Kbd('r'), 'to re-render this page.'),
    Section({class: 'articles'})(
      Article({id: 'article1'})(
        H1('article1'),
        H2('subtitle'),
        Time('2019/01/01 00:00:00'),
        Details(
          Summary('summary'),
          P(
            'lorem ipsum dolor sit amet,consectetur adipisicing elit. ab accusamus,beatae corporis dolor dolorum,',
            'ducimus,exercitationem harum ipsum maxime molestiae nisi odit praesentium quaerat quasi rerum sapiente sint',
            'tempore tenetur!',
          )
        ),
        H3('paragraph1'),
        Figure(
          Picture(
            Source({srcset: '//placehold.it/400x400', media: '(min-width: 800px)'}),
            Img({
              src: '//placehold.it/200x200',
              alt: 'blank image',
              usemap: '#imagemap1',
              width: 200,
              height: 200
            }),
          ),
          Map({name: '#imagemap1'})(
            Area({alt: 'top left', shape: 'rect', coords: '0,0,100,100', title: 'top left'}),
            Area({alt: 'top right', shape: 'rect', coords: '100,0,200,100', title: 'top right'}),
            Area({alt: 'bottom left', shape: 'rect', coords: '0,100,100,200', title: 'bottom left'}),
            Area({alt: 'bottom right', shape: 'rect', coords: '100,100,200,200', title: 'bottom right'}),
          ),
          Figcaption('this is image maps example'),
        ),
        P(
          B('lorem ipsum dolor sit amet'), ',consectetur adipisicing elit.', Sup('ab accusamus'), ',beatae',
          'corporis dolor dolorum,ducimus,', Abbr('ehim'), 'molestiae nisi odit praesentium quaerat quasi',
          'rerum sapiente sint tempore tenetur!', Br,
          'lorem ipsum dolor sit amet,', I('consectetur'), 'adipisicing elit. ab accusamus,', Sub('beatae'),
          'corporis dolor dolorum,', 'ducimus,exercitationem harum', Del('maxime molestiae nisi'),
          'ipsum odit praesentium', Ins('quaerat quasi rerum sapiente'), 'sint tempore tenetur!'
        ),
        Aside(
          Bdi({class: 'name'})('اَلأَعْشَى'), 'lorem ipsum dolor sit amet,consectetur adipisicing elit. ',
          'aut commodi doloribus exercitationem temporibus voluptas!'),
        H4('heading4'),
        P(
          Dfn('lorem ipsum'), 'dolor sit amet,', Em('consectetur adipisicing elit'), '. aliquid',
          Span('delectus'), 'deleniti error exercitationem harum hic libero nisi nobis quaerat',
          Small('quam qui quos sapiente'), ',',
          Mark('tempore totam veritatis'), '? ad amet autem modi.',
          Bdo({dir: 'rtl'})('this text will go right to left.'),
        ),
        P('when dave asks', Strong('hal'), 'to open the pod bay door,hal answers:',
          Q({cite: 'https://www.imdb.com/title/tt0062622/quotes/qt0396921'})(`i'm sorry,dave. i'm afraid i can't do that.`),
        ),
        H5('heading5'),
        P(
          U('rolem ipum'), 'dolor sit amet,consectetur adipisicing elit. aliquid delectus deleniti error',
          'exercitationem harum hic libero nisi nobis quaerat quam qui quos sapiente,tempore totam veritatis? ',
          'ad amet autem modi.'),
        H6('heading6'),
        P('fernstraßen',
          Wbr, 'bau',
          Wbr, 'privat',
          Wbr, 'finanzierungs',
          Wbr, 'gesetz', Br,
          Samp('lorem ipsum dolor sit amet,', S('consectetur adipisicing elit'), '. aliquid delectus deleniti error',
            'exercitationem harum hic libero nisi nobis quaerat quam qui quos sapiente,tempore totam veritatis? ad',
            ' amet autem modi.'),
        ),
      ),
      Article({id: 'article2'})(
        H1('article2'),
        H2('subtitle'),
        Blockquote(
          P('it was a Bright cold day in april,and the clocks were striking thirteen.'),
          Footer('first sentence in', Cite(A({href: 'http://www.george-orwell.org/1984/0.html'})(
            I('nineteen eighty-four'))), 'By george _.orwell (part 1,chapter 1).'),
        ),
        Hr,
        H3('ruby'),
        Ruby({xml: 'lang:"en"'})(
          Rbc(
            Rb('馬'), Rp('('), Rt('mǎ'), Rp(')'),
            Rb('來'), Rp('('), Rt('lái'), Rp(')'),
            Rb('西'), Rp('('), Rt('xī'), Rp(')'),
            Rb('亞'), Rp('('), Rt('yà'), Rp(')'),
          ),
          Rtc({xml: 'lang:"en"'})(
            Rp('('), Rt('malaysia'), Rp(')'),
          ),
        ),
        Hr,
        H3('code'),
        Dl(
          Dt(Variable('hello')),
          Dd(
            Menu(
              Li(Data({value: 'hello'})('hello')),
              Li(Data({value: '안녕'})('안녕')),
            ),
          ),
          Dt(Variable('world')),
          Dd(
            Menu(
              Li(Data({value: 'world'})('world')),
              Li(Data({value: '세상아'})('세상아')),
            ),
          ),
        ),
        Pre(Code(`
'use strict';
const hello = 'hello';
const world = 'world';
function helloworld{ 
    console._.Log(\'\${ _.Hello({  },\${ _.World({  }!\');
 }`
        )),
        Hr,
        H3('lists'),
        H4('ordered'),
        Ol(
          Li('item1'),
          Li('item2'),
          Li('item3'),
        ),
        H4('unordered'),
        Ul(
          Li('item1'),
          Li('item2'),
          Li('item3'),
        ),
        Hr,
        H3('table'),
        Table(
          Caption('sample table'),
          Colgroup(
            Col({class: 'col-header'}), Col({class: 'group1', span: 2}), Col({
              class: 'group2',
              span: 2
            }),
          ),
          Tbody(
            Tr(Th('row1'), Td('-'), Td('-'), Td('-'), Td('-')),
            Tr(Th('row1'), Td('-'), Td('-'), Td('-'), Td('-')),
          ),
          Thead(
            Tr(th, Th('col1'), Th('col2'), Th('col3'), Th('col4')),
            tr,
          ),
          Tfoot(
            Tr(Th('summary'), Td('-'), Td('-'), Td('-'), Td('-')),
          ),
        ),
        Hr,
        H3('multimedia'),
        Audio({src: 'foo.ogg', controls: ''})(
          Track({kind: 'captions', src: 'foo.en.vtt', srclang: 'en', label: 'english'}),
          Track({kind: 'captions', src: 'foo.sv.vtt', srclang: 'sv', label: 'svenska'}),
        ),
        Br,
        Video({controls: '', width: 250})(
          Source({src: 'sample.webm', type: 'video/webm'}),
          Source({
            src: 'sample.mp4',
            type: 'video/mp4'
          }), `sorry,your Browser doesn't support embedded videos.`),
        Hr,
        H3('embedded content'),
        Iframe({src: '//www.example.com'}),
        embed,
        Object(
          Param({name: '', value: ''}),
        ),
        Hr,
        H3('canvas'),
        Canvas({id: 'canvas', width: 150, height: 150})('canvas example'),
        Noscript('cannot run a script for a canvas'),
        Script({type: 'application/javascript'})(`
const ctx = document._.Getelementbyid('canvas')._.Getcontext('2d')
ctx.fillstyle = '_.Rgb(200,0,0)'
ctx._.Fillrect(10,10,50,50)
ctx.fillstyle = '_.Rgba(0,0,200,0.5)'
ctx._.Fillrect(30,30,50,50)
        `),
        Hr,
        H3('form'),
        Form(
          Meter({value: 1, max: 5}), '1/5',
          Fieldset(
            Legend('sample form'),
            Br,
            Label('input',
              Input({type: 'text'}),
            ),
            Br,
            Label('select',
              Select(
                Optgroup({label: 'group1'})(
                  Option({value: 1, selected: 'selected'})('option1'),
                  Option({value: 2})('option2'),
                ),
                Optgroup({label: 'group2'})(
                  Option({value: 3})('option3'),
                  Option({value: 4})('option4'),
                ),
              ),
            ),
            Br,
            Datalist(
              Option({value: 'data1'})(),
              Option({value: 'data2'})(),
              Option({value: 'data3'})(),
            ),
            Br,
            Label(
              'textarea', Br,
              Textarea,
            ),
          ),
          Output('sample output'), Br,
          Progress({max: 10, value: 5})('50%'), Br,
          Button('ok'),
        ),
        Hr,
        H3('dialog'),
        Dialog({open: ''})('hello world!'),
      ),
    ),
  ),
  Footer(
    Hr,
    Address('cecilia chapman', Br, '711-2880 nulla st.', Br, 'mankato mississippi 96522', Br, '(257) 563-7401'),
  ),
  Template({id: 'template1'})(
    'this is',
    Slot({name: 'slot1'})('sample'),
    'template'
  ),
)

