<script setup>
import { FilterMatchMode } from 'primevue/api';
import ParcelService from '../../service/ParcelService';
import { ref, onBeforeMount, computed } from 'vue';

const parcels = ref(null);
const filters = ref(null);
const loading = ref(null);
const product = ref({});
const submitted = ref(false);
const productDialog = ref(false);
const statuses = ref(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal']);

const parcelService = new ParcelService();

onBeforeMount(() => {
    parcelService.getFullParcel().then((data) => {
        console.log(data)
        parcels.value = data;
        loading.value = false;
    });

    initFilters();
});

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const clearFilter = () => {
    initFilters();
};

const formatDate = (value) => {
    return (new Date(value)).toLocaleDateString('fr-FR', {
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

const thisWeightTotal = (products) => {
    let total = 0;
    for(let product of products) {
        total += product.weight;
    }

    return total;
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Liste des colis</h5>
                <DataTable
                    :value="parcels"
                    :paginator="true"
                    class="p-datatable-gridlines"
                    :rows="10"
                    dataKey="id"
                    v-model:filters="filters"
                    :loading="loading"
                    responsiveLayout="scroll"
                    :globalFilterFields="['name', 'country.name', 'representative.name', 'balance', 'status']"
                >
                    
                    <template #empty> No parcels found. </template>
                    <template #loading> Loading parcels data. Please wait. </template>
                    <Column  filterField="code" header="N° Colis" headerStyle="min-width:7rem;">
                        <template #body="{ data }">
                            #{{ data.code }}
                        </template>
                    </Column>
                    <Column field="name" header="N° Commande" headerStyle="width:10%; min-width:10rem;">
                        <template #body="{ data }">
                            #{{ data.order.code }}
                        </template>
                    </Column>
                    <Column field="name" header="Libellé" headerStyle="width:30%; min-width:12rem;">
                        <template #body="{ data }">
                            {{ data.label }}
                        </template>
                    </Column>
                    <Column field="name" header="Nbr. produits" headerStyle="width:10%; min-width:9rem;">
                        <template #body="{ data }">
                            {{ data.products.length }}
                        </template>
                    </Column>
                    <Column field="name" header="Poids" headerStyle="width:8%; min-width:6rem;">
                        <template #body="{ data }">
                            {{ thisWeightTotal(data.products) }} KG
                        </template>
                    </Column>
                    <Column header="Date" headerStyle="width:10%; min-width:6rem;">
                        <template #body="{ data }">
                            {{ formatDate(data.createdAt) }}
                        </template>
                    </Column>
                    <Column header="Numéro de suivi" headerStyle="width:15%; min-width:6rem;">
                        <template #body="{ data }">
                            {{ data.tracking }}
                        </template>
                    </Column>
                    <Column header="Statut" headerStyle="width:13%; min-width:6rem;">
                        <template #body="{ data }">
                            <span v-if="!data.tracking" class="customer-badge status-proposal">Préparation</span>
                            <span v-if="data.tracking" class="customer-badge status-qualified">Expédié</span>
                        </template>
                    </Column>
                    <Column bodyClass="text-center" headerStyle="width:12%; min-width:8rem;">
                        <template #body="{ data }">
                            <Button v-if="!data.tracking" icon="pi pi-cog" class="p-button-rounded p-button-primary" @click="openNew" />
                            <a :href="`https://www.laposte.fr/outils/suivre-vos-envois?code=${data.tracking}`" target="_blank" v-if="data.tracking" class="p-button p-button-rounded p-button-success"><i class="pi pi-truck"></i></a>
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