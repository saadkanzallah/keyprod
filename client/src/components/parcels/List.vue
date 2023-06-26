<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import CustomerService from '@/service/CustomerService';
import { ref, onBeforeMount } from 'vue';

const customer1 = ref(null);
const filters1 = ref(null);
const loading1 = ref(null);
const product = ref({});
const submitted = ref(false);
const productDialog = ref(false);
const statuses = ref(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal']);
const representatives = ref([
    { name: 'Amy Elsner', image: 'amyelsner.png' },
    { name: 'Anna Fali', image: 'annafali.png' },
    { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
    { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
    { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
    { name: 'Onyama Limba', image: 'onyamalimba.png' },
    { name: 'Stephen Shaw', image: 'stephenshaw.png' },
    { name: 'XuXue Feng', image: 'xuxuefeng.png' }
]);

const customerService = new CustomerService();

onBeforeMount(() => {
    customerService.getCustomersLarge().then((data) => {
        customer1.value = data;
        loading1.value = false;
        customer1.value.forEach((customer) => (customer.date = new Date(customer.date)));
    });

    initFilters1();
});

const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        activity: { value: [0, 50], matchMode: FilterMatchMode.BETWEEN },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
};

const clearFilter1 = () => {
    initFilters1();
};
const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const formatDate = (value) => {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};
const openNew = () => {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
};
const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
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
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Liste des colis</h5>
                <DataTable
                    :value="customer1"
                    :paginator="true"
                    class="p-datatable-gridlines"
                    :rows="10"
                    dataKey="id"
                    v-model:filters="filters1"
                    :loading="loading1"
                    responsiveLayout="scroll"
                    :globalFilterFields="['name', 'country.name', 'representative.name', 'balance', 'status']"
                >
                    <template #header>
                        <div class="flex justify-content-end">
                            <span class="p-input-icon-left mb-2">
                                <i class="pi pi-search" />
                                <InputText v-model="filters1['global'].value" placeholder="Recherche" style="width: 100%" />
                            </span>
                        </div>
                    </template>
                    <template #empty> No parcels found. </template>
                    <template #loading> Loading parcels data. Please wait. </template>
                    <Column field="name" header="N° Colis" headerStyle="min-width:7rem;">
                        <template #body="{ data }">
                            {{ data.id }}
                        </template>
                    </Column>
                    <Column field="name" header="N° Commande" headerStyle="width:10%; min-width:10rem;">
                        <template #body="{ data }">
                            {{ data.id }}
                        </template>
                    </Column>
                    <Column field="name" header="Libellé" headerStyle="width:30%; min-width:12rem;">
                        <template #body="{ data }">
                            {{ data.name }}
                        </template>
                    </Column>
                    <Column field="name" header="Nbr. produits" headerStyle="width:10%; min-width:9rem;">
                        <template #body="{ data }">
                            2
                        </template>
                    </Column>
                    <Column field="name" header="Poids" headerStyle="width:8%; min-width:6rem;">
                        <template #body="{ data }">
                            10 KG
                        </template>
                    </Column>
                    <Column header="Date" filterField="date" headerStyle="width:10%; min-width:6rem;">
                        <template #body="{ data }">
                            {{ formatDate(data.date) }}
                        </template>
                    </Column>
                    <Column header="Numéro de suivi" headerStyle="width:15%; min-width:6rem;">
                        <template #body="{ data }">
                            {{ formatCurrency(data.balance) }}
                        </template>
                    </Column>
                    <Column header="Statut" headerStyle="width:10%; min-width:6rem;">
                        <template #body="{ data }">
                            <span :class="'customer-badge status-' + data.status">{{ data.status }}</span>
                        </template>
                    </Column>
                    <Column bodyClass="text-center" headerStyle="width:12%; min-width:8rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-truck" class="p-button-rounded p-button-primary" @click="openNew" />
                        </template>
                    </Column>
                </DataTable>
                <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Ajouter un numéro de suivi" :modal="true" class="p-fluid">
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
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';

::v-deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>