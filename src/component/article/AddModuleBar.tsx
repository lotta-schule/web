import React, { FunctionComponent, memo } from "react";
import { makeStyles } from "@material-ui/styles";
import { Theme, Typography, Grid } from "@material-ui/core";
import { TextFormat, FormatListBulleted, FormatAlignLeft, AddPhotoAlternate, Audiotrack, MovieCreation, PictureAsPdf, Link } from '@material-ui/icons';
import { ContentModuleModel, ContentModuleType } from "model";
import { AddModuleButton } from "./AddModuleButton";
import { Value } from 'slate';
const { serialize } = require('slate-base64-serializer').default;

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: '1em',
        margin: '0.5em 0 0 0',
        backgroundColor: '#fff'
    }
}));

export interface AddModuleBarProps {
    onAddModule(module: ContentModuleModel): void;
}

export const AddModuleBar: FunctionComponent<AddModuleBarProps> = memo(({ onAddModule }) => {

    const styles = useStyles();

    return (
        <div className={styles.root}>
            <Typography style={{ marginBottom: '1em' }}>Füge ein Modul zum Beitrag hinzu, indem du drauf klickst.</Typography>
            <Grid
                container
                direction="row"
                justify="space-between"
                color={'primary'}
                alignItems="center"
            >
                <Grid item xs={1}>
                    <AddModuleButton
                        label={'Titel'}
                        icon={<TextFormat />}
                        onClick={() => {
                            onAddModule({
                                id: `temp-${new Date().getTime().toString()}`,
                                sortKey: null!,
                                type: ContentModuleType.TITLE,
                                text: 'Titel',
                                files: [],
                            });
                        }}
                    />
                </Grid>
                <Grid item xs={1}>
                    <AddModuleButton
                        label={'Text'}
                        icon={<FormatAlignLeft />}
                        onClick={() => {
                            onAddModule({
                                id: `temp-${new Date().getTime().toString()}`,
                                sortKey: null!,
                                type: ContentModuleType.TEXT,
                                text: serialize(Value.fromJSON({ object: "value", document: { object: "document", data: {}, nodes: [{ object: "block", type: "paragraph", data: {}, nodes: [{ object: 'text', text: "Lorem ipsum...", marks: [] } as any] }] } })),
                                files: [],
                            });
                        }}
                    />
                </Grid>
                <Grid item xs={1}>
                    <AddModuleButton label={'Liste'} icon={<FormatListBulleted />} />
                </Grid>
                <Grid item xs={1}>
                    <AddModuleButton
                        label={'Bild'}
                        icon={<AddPhotoAlternate />}
                        onClick={() => {
                            onAddModule({
                                id: `temp-${new Date().getTime().toString()}`,
                                sortKey: null!,
                                type: ContentModuleType.IMAGE,
                                text: undefined,
                                files: [],
                            });
                        }}
                    />
                </Grid>
                <Grid item xs={1}>
                    <AddModuleButton
                        label={'Video'}
                        icon={<MovieCreation />}
                        onClick={() => {
                            onAddModule({
                                id: `temp-${new Date().getTime().toString()}`,
                                sortKey: null!,
                                type: ContentModuleType.VIDEO,
                                text: undefined,
                                files: [],
                            });
                        }}
                    />
                </Grid>
                <Grid item xs={1}>
                    <AddModuleButton
                        label={'Audio'}
                        icon={<Audiotrack />}
                        onClick={() => {
                            onAddModule({
                                id: `temp-${new Date().getTime().toString()}`,
                                sortKey: null!,
                                type: ContentModuleType.AUDIO,
                                text: undefined,
                                files: [],
                            });
                        }}
                    />
                </Grid>
                <Grid item xs={1}>
                    <AddModuleButton label={'PDF'} icon={<PictureAsPdf />} />
                </Grid>
                <Grid item xs={1}>
                    <AddModuleButton label={'Link'} icon={<Link />} />
                </Grid>
            </Grid>
        </div>
    );
});