import { Button, Card, Flex, Table, Typography } from "antd";
import React from "react";
import { useMetadata } from "@/hooks/useMetadata";
import { clientColumns } from "./client-columns";
import { NoClientsCard } from "./no-clients-card";
import { RegisterClientModal, useClientRegistration } from "./register-client";
import { ClientSearchTerms, useClientSearch } from "./use-client-search";

/** The clients matching the search, or a card to register one when none do. */
export function ClientSearchScreen({
    search,
    onOpenClient,
}: {
    search: ClientSearchTerms;
    onOpenClient: (trackedEntity: string) => void;
}) {
    const metadata = useMetadata();
    const { clients, terms } = useClientSearch(search);
    const registration = useClientRegistration();

    if (clients.length === 0) {
        return Object.values(terms).some(Boolean) ? (
            <NoClientsCard message="No clients found matching your search criteria." searchTerms={terms} />
        ) : (
            <NoClientsCard message="" />
        );
    }

    return (
        <Card
            variant="borderless"
            extra={
                <Flex gap="small" align="center" justify="space-between" style={{ width: "100%" }}>
                    <Typography.Text>{`${clients.length} results matching`}</Typography.Text>
                    <Button type="primary" size="large" onClick={() => registration.start()}>
                        Register New Client
                    </Button>
                </Flex>
            }
            style={{ height: "calc(100vh - 144px)" }}
        >
            <Table
                columns={clientColumns(metadata)}
                dataSource={clients}
                rowKey="trackedEntity"
                pagination={{
                    pageSize: 5,
                    showSizeChanger: true,
                    total: clients.length,
                    showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total}`,
                    hideOnSinglePage: true,
                }}
                onRow={(record) => ({
                    onClick: () => onOpenClient(record.trackedEntity),
                    style: { cursor: "pointer" },
                })}
                scroll={{ x: "max-content" }}
            />
            <RegisterClientModal registration={registration} />
        </Card>
    );
}
