<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, computed, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRoute } from 'vue-router';
import OrderService from '../../service/OrderService';

const toast = useToast();

const producCode = ref(null);
const order = ref(null);
const products = ref([]);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref(null);
let selectedProductsNames = ref(null);
let selectedProductsPoids = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const statuses = ref([
    { label: 'En cours de préparation', value: 'instock' },
    { label: 'Expédiée', value: 'lowstock' },
    { label: 'Livrée', value: 'outofstock' }
]);

const orderService = new OrderService();

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    const route = useRoute();
    orderService.getFullOrder(route.params.id).then((data) => {
        order.value = data;
        products.value = data.products ?? [];
    });
});
const formatCurrency = (value) => {
    return value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
};
const openNew = () => {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
    console.log(selectedProducts)
    selectedProductsNames = selectedProducts.value.map((val) => val.code);
    selectedProductsPoids = selectedProducts.value.map((val) => val.weight).reduce((a, b) => a + b);
    console.log(selectedProductsPoids)
};
const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};
const confirmDeleteSelected = () => {
    deleteProductsDialog.value = true;
};
const deleteProduct = () => {
    products.value = products.value.filter((val) => val.id !== product.value.id);
    deleteProductDialog.value = false;
    product.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
};

const deleteSelectedProducts = () => {
    products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};
const saveProduct = () => {
    if (producCode && producCode.value) {
        if (producCode.value === 'saad') {
            product.value.id = createId();
            product.value.code = createId();
            product.value.name = 'keyprod';
            product.value.image = 'product-placeholder.svg';
            product.value.inventoryStatus = product.value.inventoryStatus ? product.value.inventoryStatus.value : 'INSTOCK';
            product.value.price = 100;
            products.value.push(product.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        } else {
            toast.add({ severity: 'warn', summary: 'Error', detail: `Product ${producCode.value} Not found`, life: 3000 });
        }
        product.value = {};
        producCode.value = null;
    }
};

const thisWeightTotal = computed(() => {
    let total = 0;
    for(let product of products.value) {
        total += product.weight;
    }

    return total + ' KG';
});

const onRowSelect = (event) => {
    if(event.data.id == 1000) {
        selectedProducts.value = selectedProducts.value.filter((val) => val.id !== event.data.id);
        toast.add({ severity: 'warn', summary: 'Produit déjà dans un colis', detail: 'Name: ' + event.data.name, life: 3000 });
    }
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Affectation des produits de la commande #{{ order?.code }}</h5>
                <h6>Client: <b>{{ order?.client }}</b></h6>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
        </div>

        <div class="col-12">
            <div class="card">
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:end>
                        <Button label="Créer un colis" icon="pi pi-box" class="p-button-info" @click="openNew" :disabled="!selectedProducts || !selectedProducts.length" />
                    </template>
                </Toolbar>
                <DataTable
                    ref="dt"
                    class="p-datatable-gridlines table-no-select-all"
                    :value="products"
                    v-model:selection="selectedProducts"
                    dataKey="id"
                    :paginator="true"
                    :selectAll="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Affichage de {first} à {last} sur {totalRecords} produits"
                    responsiveLayout="scroll"
                    @rowSelect="onRowSelect" 
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Liste des produits</h5>
                        </div>
                    </template>
                    <Column selectionMode="multiple" headerStyle="width:5%;width: 3rem" class="selectInput"></Column>
                    <Column field="code" header="Code" headerStyle="width:20%; min-width:10rem;">
                        <template #body="{ data }">
                            {{ data.code }}
                        </template>
                    </Column>
                    <Column field="category" header="Catégorie" headerStyle="width:20%; min-width:10rem;">
                        <template #body="{ data }">
                            <img :src="`/${data.category}.png`" width="64" style="vertical-align: middle" />
                            <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{ data.category }}</span>
                        </template>
                    </Column>
                    <Column field="code" header="Version" headerStyle="width:15%; min-width:10rem;">
                        <template #body="{ data }">
                            {{ data.version }}
                        </template>
                    </Column>
                    <Column field="ref" header="Référence" headerStyle="width:30%; min-width:10rem;">
                        <template #body="{ data }">
                            {{ data.category + '_' + data.version + '_' + data.code}}
                        </template>
                    </Column>
                    <Column field="price" header="Poids" headerStyle="width:15%; min-width:8rem;">
                        <template #body="{ data }">
                            {{ data.weight }} KG
                        </template>
                    </Column>
                    <ColumnGroup type="footer">
                        <Row>
                            <Column footer="Poids total:" :colspan="5" footerStyle="text-align:right" />
                            <Column :footer="thisWeightTotal" />
                        </Row>
                    </ColumnGroup>
                </DataTable>

                <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Créer un colis" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="name">Produirs</label>
                        <Chips v-model="selectedProductsNames" disabled required="true" />
                    </div>
                    <div class="field">
                        <label for="name">Poids</label>
                        <div class="p-inputgroup flex-1">
                            <InputText v-model="selectedProductsPoids" readonly required="true" />
                            <span class="p-inputgroup-addon">
                                KG
                            </span>
                        </div>
                    </div>
                    <div class="field">
                        <label for="name">Nom</label>
                        <InputText id="name" v-model.trim="product.name" required="true" autofocus :class="{ 'p-invalid': submitted && !product.name }" />
                        <small class="p-invalid" v-if="submitted && !product.name">Name is required.</small>
                    </div>
                    <div class="field">
                        <label for="description">Commentaire</label>
                        <Textarea id="description" v-model="product.description" required="true" rows="3" cols="20" />
                    </div>
                    <div class="field">
                        <label for="name">Numéro de suivi</label>
                        <InputText id="name" v-model.trim="product.name" required="true" autofocus :class="{ 'p-invalid': submitted && !product.name }" />
                        <small class="p-invalid" v-if="submitted && !product.name">Name is required.</small>
                    </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product"
                            >Are you sure you want to delete <b>{{ product.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product">Are you sure you want to delete the selected products?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
<style>
.p-datatable-thead .selectInput .p-column-header-content{
     visibility: hidden !important;
}
.p-chips .p-chips-multiple-container .p-chips-token {
    margin-top: 0.5rem;
}
</style>