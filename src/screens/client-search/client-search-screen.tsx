import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Grid, Spin, Typography } from "antd";
import React, { useMemo } from "react";
import { useMetadata } from "@/hooks/useMetadata";
import { clientColumns } from "./client-columns";
import { ClientsTable } from "./clients-table";
import { NoClientsCard } from "./no-clients-card";
import { RegisterClientModal, useClientRegistration } from "./register-client";
import { byLastVisit, CLIENT_LIST_TITLES, type ClientList, useClientLists } from "./client-lists";
import { ClientSearchTerms, useClientSearch } from "./use-client-search";

const EMPTY_LIST_MESSAGES: Record<ClientList, string> = {
    all: "No clients registered at this facility yet.",
    registeredToday: "No clients registered today.",
    visitsToday: "No clients visited today.",
};

/**
 * The clients matching the search, or a stats card's list when one is
 * chosen, or a card to register a client when there are none.
 */
export function ClientSearchScreen({
    search,
    list,
    onOpenClient,
}: {
    search: ClientSearchTerms;
    list?: ClientList;
    onOpenClient: (trackedEntity: string) => void;
}) {
    const metadata = useMetadata();
    const searched = useClientSearch(list ? undefined : search);
    const clientLists = useClientLists();
    const searchResults = useMemo(
        () => byLastVisit(searched.clients, clientLists.lastVisits),
        [searched.clients, clientLists.lastVisits],
    );
    const clients = list ? clientLists.lists[list] : searchResults;
    const terms = searched.terms;
    const loading = list === "visitsToday" ? clientLists.visitsLoading : list ? clientLists.loading : searched.loading;
    const registration = useClientRegistration();
    const columns = useMemo(() => clientColumns(metadata, clientLists.lastVisits), [metadata, clientLists.lastVisits]);
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.lg;
    // Desktop: fit under the stats cards so the table body scrolls, not the page.
    // Small screens: the page scrolls past the cards and search to a table most of a screen tall.
    const panelHeight = isMobile ? "max(420px, 75vh)" : "calc(100vh - 144px - 127px)";

    if (loading) {
        return (
            <Card variant="borderless" style={{ height: isMobile ? 200 : "calc(100vh - 144px - 127px)" }}>
                <Flex vertical align="center" justify="center" gap="small" style={{ height: "100%" }}>
                    <Spin />
                    <Typography.Text type="secondary">Loading clients…</Typography.Text>
                </Flex>
            </Card>
        );
    }

    if (clients.length === 0) {
        if (list) return <NoClientsCard message={EMPTY_LIST_MESSAGES[list]} />;
        return Object.values(terms).some(Boolean) ? (
            <NoClientsCard message="No clients found matching your search criteria." searchTerms={terms} />
        ) : (
            <NoClientsCard message="" />
        );
    }

    return (
        <Card
            variant="borderless"
            style={{ height: panelHeight, display: "flex", flexDirection: "column" }}
            styles={{
                body: { flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: 8, padding: isMobile ? 8 : 12 },
            }}
        >
            <Flex gap="small" align="center" justify="space-between" wrap>
                <Typography.Text strong>
                    {list ? `${CLIENT_LIST_TITLES[list]}: ${clients.length} clients` : `${clients.length} results matching`}
                </Typography.Text>
                <Button
                    type="primary"
                    size={isMobile ? "middle" : "large"}
                    icon={<PlusOutlined />}
                    block={!screens.sm}
                    onClick={() => registration.start()}
                >
                    Register New Client
                </Button>
            </Flex>
            <ClientsTable
                clients={clients}
                columns={columns}
                lastVisits={clientLists.lastVisits}
                onOpenClient={onOpenClient}
            />
            <RegisterClientModal registration={registration} />
        </Card>
    );
}
