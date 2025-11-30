<script setup lang="ts">
import { computed } from 'vue';
import Button from '@/components/ui/button/Button.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Rocket } from 'lucide-vue-next';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    status?: 'pending' | 'approved' | 'rejected'; // Add status field
}

interface Props {
    products: Product[];
}

const props = defineProps<Props>();

// Declare the global route function
declare global {
    function route(name: string, params?: any, absolute?: boolean): string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Applications',
        href: '/applications',
    },
];

const page = usePage();

const createProductRoute = route('products.create');
const editProductRoute = (id: number | string) => route('products.edit', { id });

// Access flash message with proper typing
const flashMessage = computed(() => (page.props.flash as { message?: string })?.message);

// Filter products by status
const filteredProducts = (status: string) => {
    if (status === 'all') return props.products;
    return props.products.filter(product => product.status === status);
};

// Count products by status
const statusCounts = computed(() => ({
    all: props.products.length,
    pending: props.products.filter(p => p.status === 'pending').length,
    approved: props.products.filter(p => p.status === 'approved').length,
    rejected: props.products.filter(p => p.status === 'rejected').length,
}));

const handleDelete = (id: number | string) => {
    if (confirm('Are you sure you want to delete this product?')) {
        router.delete(route('products.destroy', { id }))
    }
};
</script>

<template>
    <Head title="Applications" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="p-4">
            <div v-if="flashMessage" class="mb-4">
                <Alert class="bg-blue-800">
                    <Rocket class="h-4 w-4" />
                    <AlertTitle>Notification!</AlertTitle>
                    <AlertDescription>
                        {{ flashMessage }}
                    </AlertDescription>
                </Alert>
            </div>

            <div class="mb-4">
                <Link :href="createProductRoute">
                    <Button>Create an Application</Button>
                </Link>
            </div>

            <Tabs default-value="all" class="w-full">
                <TabsList class="grid w-full max-w-md grid-cols-4">
                    <TabsTrigger value="all">
                        All ({{ statusCounts.all }})
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                        Pending ({{ statusCounts.pending }})
                    </TabsTrigger>
                    <TabsTrigger value="approved">
                        Approved ({{ statusCounts.approved }})
                    </TabsTrigger>
                    <TabsTrigger value="rejected">
                        Rejected ({{ statusCounts.rejected }})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    <Table>
                        <TableCaption>A list of all applications made by users.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead class="w-[100px]">ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Book Name</TableHead>
                                <TableHead>Date Applied</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead class="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="product in filteredProducts('all')" :key="product.id">
                                <TableCell>{{ product.id }}</TableCell>
                                <TableCell class="font-medium">{{ product.name }}</TableCell>
                                <TableCell>{{ product.price }}</TableCell>
                                <TableCell>{{ product.description }}</TableCell>
                                <TableCell>
                                    <span :class="{
                                        'px-2 py-1 rounded-full text-xs font-medium': true,
                                        'bg-yellow-100 text-yellow-800': product.status === 'pending',
                                        'bg-green-100 text-green-800': product.status === 'approved',
                                        'bg-red-100 text-red-800': product.status === 'rejected',
                                    }">
                                        {{ product.status || 'pending' }}
                                    </span>
                                </TableCell>
                                <TableCell class="text-center space-x-2">
                                    <Link :href="editProductRoute(product.id)">
                                        <Button variant="outline">Edit</Button>
                                    </Link>
                                    <Button variant="destructive" @click="handleDelete(product.id)">Delete</Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TabsContent>

                <TabsContent value="pending">
                    <Table>
                        <TableCaption>Applications pending review.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead class="w-[100px]">ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Book Name</TableHead>
                                <TableHead>Date Applied</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead class="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="product in filteredProducts('pending')" :key="product.id">
                                <TableCell>{{ product.id }}</TableCell>
                                <TableCell class="font-medium">{{ product.name }}</TableCell>
                                <TableCell>{{ product.price }}</TableCell>
                                <TableCell>{{ product.description }}</TableCell>
                                <TableCell>
                                    <span class="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        pending
                                    </span>
                                </TableCell>
                                <TableCell class="text-center space-x-2">
                                    <Link :href="editProductRoute(product.id)">
                                        <Button variant="outline">Edit</Button>
                                    </Link>
                                    <Button variant="destructive" @click="handleDelete(product.id)">Delete</Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TabsContent>

                <TabsContent value="approved">
                    <Table>
                        <TableCaption>Approved applications.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead class="w-[100px]">ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Book Name</TableHead>
                                <TableHead>Date Applied</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead class="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="product in filteredProducts('approved')" :key="product.id">
                                <TableCell>{{ product.id }}</TableCell>
                                <TableCell class="font-medium">{{ product.name }}</TableCell>
                                <TableCell>{{ product.price }}</TableCell>
                                <TableCell>{{ product.description }}</TableCell>
                                <TableCell>
                                    <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        approved
                                    </span>
                                </TableCell>
                                <TableCell class="text-center space-x-2">
                                    <Link :href="editProductRoute(product.id)">
                                        <Button variant="outline">Edit</Button>
                                    </Link>
                                    <Button variant="destructive" @click="handleDelete(product.id)">Delete</Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TabsContent>

                <TabsContent value="rejected">
                    <Table>
                        <TableCaption>Rejected applications.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead class="w-[100px]">ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Book Name</TableHead>
                                <TableHead>Date Applied</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead class="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="product in filteredProducts('rejected')" :key="product.id">
                                <TableCell>{{ product.id }}</TableCell>
                                <TableCell class="font-medium">{{ product.name }}</TableCell>
                                <TableCell>{{ product.price }}</TableCell>
                                <TableCell>{{ product.description }}</TableCell>
                                <TableCell>
                                    <span class="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        rejected
                                    </span>
                                </TableCell>
                                <TableCell class="text-center space-x-2">
                                    <Link :href="editProductRoute(product.id)">
                                        <Button variant="outline">Edit</Button>
                                    </Link>
                                    <Button variant="destructive" @click="handleDelete(product.id)">Delete</Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TabsContent>
            </Tabs>
        </div>
    </AppLayout>
</template>
