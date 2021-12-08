import * as React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
} from '@material-ui/core';
import { AddCircle, ExpandMore } from '@material-ui/icons';
import { DragHandle } from 'shared/general/icon';
import { useMutation } from '@apollo/client';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { ID, UserGroupModel, UserGroupInputModel } from 'model';
import { useUserGroups } from 'util/tenant/useUserGroups';
import { Button } from 'shared/general/button/Button';
import { ErrorMessage } from 'shared/general/ErrorMessage';
import { CreateUserGroupDialog } from './CreateUserGroupDialog';
import { EditGroupForm } from './EditGroupForm';

import UpdateUserGroupMutation from 'api/mutation/UpdateUserGroupMutation.graphql';

import styles from './GroupList.module.scss';

export const GroupList = () => {
    const groups = useUserGroups();
    const [expandedGroupId, setExpandedGroupId] = React.useState<ID | null>(
        null
    );
    const [isCreateUserGroupDialogOpen, setIsCreateUserGroupDialogOpen] =
        React.useState(false);

    const [updateGroup, { error }] = useMutation<
        { group: UserGroupModel },
        { id: ID; group: UserGroupInputModel }
    >(UpdateUserGroupMutation, {
        optimisticResponse: ({ id, group }) => {
            return {
                __typename: 'Mutation',
                group: {
                    __typename: 'UserGroup',
                    id,
                    sortKey: group.sortKey,
                },
            } as any;
        },
    });

    return (
        <div>
            <Grid container>
                <Grid item sm={8}></Grid>
                <Grid item sm={4}>
                    <Button
                        small
                        className={styles.createButton}
                        icon={<AddCircle />}
                        onClick={() => setIsCreateUserGroupDialogOpen(true)}
                    >
                        Gruppe erstellen
                    </Button>
                    <CreateUserGroupDialog
                        isOpen={isCreateUserGroupDialogOpen}
                        onAbort={() => setIsCreateUserGroupDialogOpen(false)}
                        onConfirm={(group) => {
                            setIsCreateUserGroupDialogOpen(false);
                            setExpandedGroupId(group.id);
                        }}
                    />
                </Grid>
            </Grid>
            <DragDropContext
                onDragEnd={({ destination, source }) => {
                    if (!destination) {
                        return;
                    }
                    if (
                        destination.droppableId === source.droppableId &&
                        destination.index === source.index
                    ) {
                        return;
                    }

                    const newGroupsArray = Array.from(groups);
                    newGroupsArray.splice(source.index, 1);
                    newGroupsArray.splice(
                        destination.index,
                        0,
                        groups[source.index]
                    );
                    const from =
                        source.index < destination.index
                            ? source.index
                            : destination.index;
                    const to =
                        destination.index > source.index
                            ? destination.index + 1
                            : source.index + 1;
                    newGroupsArray.slice(from, to).forEach((group, index) => {
                        if (group) {
                            updateGroup({
                                variables: {
                                    id: group.id,
                                    group: {
                                        name: group.name,
                                        sortKey: (from + index) * 10 + 10,
                                    },
                                },
                            });
                        }
                    });
                }}
            >
                <ErrorMessage error={error} />
                <Droppable droppableId={'groups-root'} type={'root-groups'}>
                    {({ droppableProps, innerRef, placeholder }) => (
                        <div
                            {...droppableProps}
                            ref={innerRef}
                            style={{ paddingBottom: '5em' }}
                        >
                            {groups.map((group, index) => (
                                <Draggable
                                    key={group.id}
                                    draggableId={String(group.id)}
                                    index={index}
                                >
                                    {({
                                        innerRef,
                                        dragHandleProps,
                                        draggableProps,
                                    }) => (
                                        <Accordion
                                            key={group.id}
                                            expanded={
                                                expandedGroupId === group.id
                                            }
                                            onChange={(_, expanded) =>
                                                setExpandedGroupId(
                                                    expanded ? group.id : null
                                                )
                                            }
                                            TransitionProps={{
                                                unmountOnExit: true,
                                            }}
                                            innerRef={innerRef}
                                            {...draggableProps}
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMore />}
                                                aria-controls={`group-panel-${group.id}-content`}
                                                id={`group-panel-${group.id}-header`}
                                            >
                                                <div>
                                                    <span
                                                        {...dragHandleProps}
                                                        style={{
                                                            verticalAlign:
                                                                'top',
                                                        }}
                                                    >
                                                        <DragHandle
                                                            className={
                                                                styles.draghandleIcon
                                                            }
                                                        />
                                                    </span>
                                                    {group.name}
                                                </div>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <EditGroupForm group={group} />
                                            </AccordionDetails>
                                        </Accordion>
                                    )}
                                </Draggable>
                            ))}
                            {placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};
