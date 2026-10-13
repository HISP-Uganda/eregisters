import { Button, Card, Flex, Result, Table, Typography } from "antd";
import React, { useState } from "react";
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
    // The chosen page belongs to the search it was chosen in: a new search starts at page 1.
    const searchKey = JSON.stringify(search ?? {});
    const [chosen, setChosen] = useState({ searchKey, page: 1, pageSize: 5 });
    const paging = { page: chosen.searchKey === searchKey ? chosen.page : 1, pageSize: chosen.pageSize };
    const { clients, total, terms, loading, failed, retry } = useClientSearch(search, paging.page, paging.pageSize);
    const registration = useClientRegistration();

    if (failed) {
        return (
            <Card variant="borderless" style={{ height: "calc(100vh - 144px)" }}>
                <Result
                    status="error"
                    title="The search could not be run"
                    subTitle="Try again. If it keeps failing, reload the app."
                    extra={
                        <Button type="primary" size="large" onClick={retry}>
                            Try again
                        </Button>
                    }
                />
            </Card>
        );
    }
    if (loading && clients.length === 0) {
        return <Card variant="borderless" loading style={{ height: "calc(100vh - 144px)" }} />;
    }
    if (total === 0) {
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
                    <Typography.Text>{`${total} results matching`}</Typography.Text>
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
                loading={loading}
                pagination={{
                    // The page is loaded from the database; the table only shows it.
                    current: paging.page,
                    pageSize: paging.pageSize,
                    onChange: (page, pageSize) =>
                        setChosen({ searchKey, page: pageSize === paging.pageSize ? page : 1, pageSize }),
                    showSizeChanger: true,
                    total,
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
