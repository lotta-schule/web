import React, { memo } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme, Typography, ExpansionPanel, ExpansionPanelSummary } from '@material-ui/core';
import { WidgetModel } from 'model';
import { WidgetIcon } from 'component/widgets/WidgetIcon';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => {
    return ({
        heading: {
            marginBottom: theme.spacing(3),
        },
        expansionSummary: {
            backgroundColor: theme.palette.grey[200],
            '& > div > div': {
                display: 'flex',
                alignItems: 'center'
            }
        },
        selected: {
            fontWeight: 'bolder'
        }
    });
});

export interface WidgetNavigationProps {
    widgets: WidgetModel[];
    selectedWidget: WidgetModel | null;
    onSelectWidget(categoryModel: WidgetModel): void;
}

export const WidgetNavigation = memo<WidgetNavigationProps>(({ widgets, selectedWidget, onSelectWidget }) => {
    const styles = useStyles();

    return (
        <>
            <Typography variant="h5" className={styles.heading}>
                Kategorienübersicht
            </Typography>
            <div style={{ paddingBottom: '5em' }}>
                {widgets.map(widget => (
                    <ExpansionPanel key={widget.id} expanded={false}>
                        <ExpansionPanelSummary
                            aria-controls={`${widget.id}-content`}
                            id={`${widget.id}-header`}
                            className={styles.expansionSummary}
                            onClick={() => onSelectWidget(widget)}
                        >
                            <Typography component={'div'} variant={'body1'}>
                                <WidgetIcon icon={widget.configuration.icon} size={36} />
                                &nbsp;
                                <span className={clsx({ [styles.selected]: selectedWidget && selectedWidget.id === widget.id })}>
                                    {widget.title}
                                </span>
                            </Typography>
                        </ExpansionPanelSummary>
                    </ExpansionPanel>
                ))}
            </div>
        </>
    );
});