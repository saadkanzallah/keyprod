import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Checkbox from 'primevue/checkbox';
import Chips from 'primevue/chips';
import Column from 'primevue/column';
import ColumnGroup from 'primevue//columngroup';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import FileUpload from 'primevue/fileupload';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import ProgressBar from 'primevue/progressbar';
import RadioButton from 'primevue/radiobutton';
import Rating from 'primevue/rating';
import Row from 'primevue/row';
import Slider from 'primevue/slider';
import Tag from 'primevue/tag';
import Textarea from 'primevue/textarea';
import TriStateCheckbox from 'primevue/tristatecheckbox';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import ToggleButton from 'primevue/togglebutton';
import Toolbar from 'primevue/toolbar';
import router from './router'

import '@/assets/styles.scss';

const app = createApp(App)

app.use(router)
app.use(PrimeVue, {ripple: true})
app.use(ToastService);
app.component('AutoComplete', AutoComplete);
app.component('Button', Button);
app.component('Column', Column);
app.component('ColumnGroup', ColumnGroup);
app.component('Calendar', Calendar);
app.component('Checkbox', Checkbox);
app.component('Chips', Chips);
app.component('DataTable', DataTable);
app.component('Dialog', Dialog);
app.component('Dropdown', Dropdown);
app.component('FileUpload', FileUpload);
app.component('RadioButton', RadioButton);
app.component('Rating', Rating);
app.component('Row', Row);
app.component('Slider', Slider);
app.component('InputNumber', InputNumber);
app.component('InputText', InputText);
app.component('MultiSelect', MultiSelect);
app.component('ProgressBar', ProgressBar);
app.component('TriStateCheckbox', TriStateCheckbox);
app.component('Tag', Tag);
app.component('Textarea', Textarea);
app.component('Toast', Toast);
app.component('ToggleButton', ToggleButton);
app.component('Toolbar', Toolbar);

app.mount('#app')
