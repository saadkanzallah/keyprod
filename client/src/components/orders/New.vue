<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, computed, onMounted, onBeforeMount } from 'vue';
import ProductService from '../../service/ProductService';
import { useToast } from 'primevue/usetoast';

const toast = useToast();


const dropdownItems = ref([
    { name: 'Client 1', code: 'Option 1' },
    { name: 'Client 2', code: 'Option 2' },
    { name: 'Client 3', code: 'Option 3' }
]);
const dropdownItem = ref(null);
const producCode = ref(null);
const products = ref([]);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const statuses = ref([
    { label: 'En cours de préparation', value: 'instock' },
    { label: 'Expédiée', value: 'lowstock' },
    { label: 'Livrée', value: 'outofstock' }
]);

const productService = new ProductService();

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    //productService.getProducts().then((data) => (products.value = data));
});
const formatCurrency = (value) => {
    return value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
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
            product.value.price = 100 * (Math.floor(Math.random()* 10));
            products.value.push(product.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        } else {
            toast.add({ severity: 'warn', summary: 'Error', detail: `Product ${producCode.value} Not found`, life: 3000 });
        }
        product.value = {};
        producCode.value = null;
    }
};
const createId = () => {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};
const lastYearTotal = computed(() => {
    let total = 0;
    for(let product of products.value) {
        total += product.price;
    }

    return formatCurrency(total);
});

const thisYearTotal = computed(() => {
    let total = 0;
    for(let product of products.value) {
        total += product.price;
    }

    return formatCurrency(total);
});
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Création de la commande</h5>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
        </div>

        <div class="col-12">
            <div class="card">
                <h5>Séléctionner un client</h5>
                <div class="p-fluid formgrid grid">
                    <div class="field col-12 md:col-6">
                        <Dropdown id="state" v-model="dropdownItem" :options="dropdownItems" optionLabel="name" placeholder=""></Dropdown>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-12">
            <div class="card">
                <h5>Affectation de produit</h5>
                <div class="p-fluid formgrid grid">
                    <div class="field col-12 md:col-12">
                        <span class="p-input-icon-right">
                            <InputText v-model="producCode" v-on:keyup.enter="saveProduct" type="text" class="p-inputtext-lg" placeholder="Scanner le QrCode du produit" />
                            <i class="pi pi-qrcode" />
                        </span>
                    </div>
                </div>
            </div>
        </div>


        <div class="col-12">
            <div class="card">
                <Toast />
                <Toolbar class="mb-4">
                    <template #start>
                        <Button label="Supprimer" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
                    </template>
                    <template v-slot:end>
                        <Button label="Enregistrer" icon="pi pi-save" class="p-button-info" @click="confirmDeleteSelected" :disabled="!products || !products.length || !dropdownItem" />
                    </template>
                </Toolbar>
                <DataTable
                    ref="dt"
                    class="p-datatable-gridlines"
                    :value="products"
                    v-model:selection="selectedProducts"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Affichage de {first} à {last} sur {totalRecords} produits"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Liste des produits</h5>
                        </div>
                    </template>
                    <Column selectionMode="multiple" headerStyle="width:5%;width: 3rem"></Column>
                    <Column field="code" header="Code" headerStyle="width:20%; min-width:10rem;">
                        <template #body="{ data }">
                            {{ data.code }}
                        </template>
                    </Column>
                    <Column field="code" header="Catégorie" headerStyle="width:30%; min-width:10rem;">
                        <template #body="{ data }">
                            <img :src="'/demo/images/avatar/ionibowcher.png'" width="32" style="vertical-align: middle" />
                            <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{ data.name }}</span>
                        </template>
                    </Column>
                    <Column field="code" header="Version" headerStyle="width:15%; min-width:10rem;">
                        <template #body="{ data }">
                            V{{ Math.floor(Math.random()* 10) + 1 }}
                        </template>
                    </Column>
                    <Column field="price" header="Montant" headerStyle="width:15%; min-width:8rem;">
                        <template #body="{ data }">
                            {{ formatCurrency(data.price) }}
                        </template>
                    </Column>
                    <Column field="price" header="Poids" headerStyle="width:15%; min-width:8rem;">
                        <template #body="{ data }">
                            {{ Math.floor(Math.random()* 10) + 1 }} KG
                        </template>
                    </Column>
                    <ColumnGroup type="footer">
                        <Row>
                            <Column footer="Totals:" :colspan="4" footerStyle="text-align:right" />
                            <Column :footer="lastYearTotal" />
                            <Column :footer="thisYearTotal" />
                        </Row>
                    </ColumnGroup>
                </DataTable>

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