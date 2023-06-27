<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import OrderService from '../../service/OrderService';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const orders = ref(null);
const deleteOrderDialog = ref(false);
const deleteOrdersDialog = ref(false);
const order = ref({});
const selectedOrders = ref(null);
const dt = ref(null);
const filters = ref({});
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
    orderService.getOrders().then((data) => (orders.value = data)).then((d) => {console.log(d)});
});
const formatCurrency = (value) => {
    return value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
};

const deleteOrder = () => {
    orders.value = orders.value.filter((val) => val.id !== order.value.id);
    deleteOrderDialog.value = false;
    order.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Order Deleted', life: 3000 });
};

const deleteSelectedOrders = () => {
    orders.value = orders.value.filter((val) => !selectedOrders.value.includes(val));
    deleteOrdersDialog.value = false;
    selectedOrders.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Orders Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};
const formatDate = (value) => {
    return (new Date(value)).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
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
                    :value="orders"
                    v-model:selection="selectedOrders"
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
                        <template #body="{ data }">
                            <span class="p-column-title">N° Commande</span>
                            #{{ data.code }}
                        </template>
                    </Column>
                    <Column field="date" header="Date" :sortable="true" headerStyle="width:12%; min-width:10rem;">
                        <template #body="{ data }">
                            <span class="p-column-title">Date</span>
                            {{ formatDate(data.createdAt) }}
                        </template>
                    </Column>
                    <Column field="client" header="Client" :sortable="true" headerStyle="min-width:10rem;">
                        <template #body="{ data }">
                            <span class="p-column-title">Client</span>
                            {{ data.client }}
                        </template>
                    </Column>
                    <Column field="price" header="Nbr. de produits" :sortable="true" headerStyle="width:13%; min-width:8rem;">
                        <template #body="{ data }">
                            <span class="p-column-title">Nbr. de produits</span>
                            {{ data.products.length }}
                        </template>
                    </Column>
                    <Column field="price" header="Nbr. de colis" :sortable="true" headerStyle="width:12%; min-width:8rem;">
                        <template #body="{ data }">
                            <span class="p-column-title">Nbr. de colis</span>
                            {{ Math.floor(Math.random()* 10) + 1 }}
                        </template>
                    </Column>
                    <Column field="inventoryStatus" header="Statut" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                        <template #body="{ data }">
                            <span class="p-column-title">Statut</span>
                            <span :class="'product-badge status-lowstock'">En cours</span>
                        </template>
                    </Column>
                    <Column bodyClass="text-center" headerStyle="width:12%; min-width:8rem;">
                        <template #body="{ data }">
                            <RouterLink :to="{ name: 'viewOrder', params: { id: data.id }}" class="p-button p-button-rounded p-button-info mr-2">
                                <i class="pi pi-eye"></i>
                            </RouterLink>
                            <RouterLink :to="{ name: 'boxOrder', params: { id: data.id }}" class="p-button p-button-rounded p-button-primary mr-2">
                                <i class="pi pi-box"></i>
                            </RouterLink>
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="deleteOrderDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="order"
                            >Are you sure you want to delete <b>{{ order.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteOrderDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteOrder" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteOrdersDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="order">Are you sure you want to delete the selected orders?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteOrdersDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedOrders" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>