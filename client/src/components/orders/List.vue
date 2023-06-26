<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import ProductService from '../../service/ProductService';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const products = ref(null);
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
    productService.getProducts().then((data) => (products.value = data));
});
const formatCurrency = (value) => {
    return value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
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
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:end>
                        <div class="my-2">
                            <RouterLink to="/orders/new" class="p-button p-button-success mr-2">
                                <i class="pi pi-plus"></i>&nbsp;Créer une nouvelle commande
                            </RouterLink>
                        </div>
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
                    currentPageReportTemplate="Affichage de {first} à {last} sur {totalRecords} commandes"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Liste des commandes</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Recherche..." />
                            </span>
                        </div>
                    </template>

                    <Column field="code" header="N° Commande" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">N° Commande</span>
                            {{ slotProps.data.code }}
                        </template>
                    </Column>
                    <Column field="date" header="Date" :sortable="true" headerStyle="width:12%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Date</span>
                            {{ new Date().toLocaleDateString() }}
                        </template>
                    </Column>
                    <Column field="name" header="Client" :sortable="true" headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Client</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="price" header="Nbr. de produits" :sortable="true" headerStyle="width:13%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nbr. de produits</span>
                            {{ Math.floor(Math.random()* 10) + 1 }}
                        </template>
                    </Column>
                    <Column field="price" header="Nbr. de colis" :sortable="true" headerStyle="width:12%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nbr. de colis</span>
                            {{ Math.floor(Math.random()* 10) + 1 }}
                        </template>
                    </Column>
                    <Column field="price" header="Montant" :sortable="true" headerStyle="width:10%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Montant</span>
                            {{ formatCurrency(slotProps.data.price) }}
                        </template>
                    </Column>
                    <Column field="inventoryStatus" header="Statut" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Statut</span>
                            <span :class="'product-badge status-' + (slotProps.data.inventoryStatus ? slotProps.data.inventoryStatus.toLowerCase() : '')">{{ slotProps.data.inventoryStatus }}</span>
                        </template>
                    </Column>
                    <Column bodyClass="text-center" headerStyle="width:12%; min-width:8rem;">
                        <template #body="slotProps">
                            <RouterLink :to="{ name: 'viewOrder', params: { id: slotProps.data.id }}" class="p-button p-button-rounded p-button-info mr-2">
                                <i class="pi pi-eye"></i>
                            </RouterLink>
                            <RouterLink :to="{ name: 'boxOrder', params: { id: slotProps.data.id }}" class="p-button p-button-rounded p-button-primary mr-2">
                                <i class="pi pi-box"></i>
                            </RouterLink>
                        </template>
                    </Column>
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

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>