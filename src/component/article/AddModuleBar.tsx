import React, { FunctionComponent, memo } from "react";
import { makeStyles } from "@material-ui/styles";
import { Theme, Typography, Grid } from "@material-ui/core";
import { TextFormat, FormatAlignLeft, AddPhotoAlternate, Audiotrack, MovieCreation, FileCopyOutlined } from '@material-ui/icons';
import { ContentModuleModel, ContentModuleType } from "model";
import { AddModuleButton } from "./AddModuleButton";
import { Value } from 'slate';
const { serialize } = require('slate-base64-serializer').default;

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: '1em',
        margin: '0.5em 0 0 0',
        backgroundColor: theme.palette.primary.contrastText,
    }
}));

export interface AddModuleBarProps {
    onAddModule(module: ContentModuleModel): void;
}

export const AddModuleBar: FunctionComponent<AddModuleBarProps> = memo(({ onAddModule }) => {

    const styles = useStyles();

    return (
        <div className={styles.root}>
            <Typography style={{ marginBottom: '1em' }}>Füge ein Modul zum Beitrag hinzu, indem du darauf klickst.</Typography>
            <Grid
                container
                direction={'row'}
                justify={'center'}
                color={'primary'}
                alignItems={'center'}
                spacing={3}
            >
                <Grid item xs={2}>
                    <AddModuleButton
                        label={'Text'}
                        icon={<FormatAlignLeft />}
                        onClick={() => {
                            onAddModule({
                                id: new Date().getTime() + Math.random() * 1000,
                                sortKey: null!,
                                type: ContentModuleType.TEXT,
                                text: serialize(Value.fromJSON({ object: "value", document: { object: "document", data: {}, nodes: [{ object: "block", type: "paragraph", data: {}, nodes: [{ object: 'text', text: "Lorem ipsum...", marks: [] } as any] }] } })),
                                files: [],
                            });
                        }}
                    />
                </Grid>
                <Grid item xs={2}>
                    <AddModuleButton
                        label={'Titel'}
                        icon={<TextFormat />}
                        onClick={() => {
                            onAddModule({
                                id: new Date().getTime() + Math.random() * 1000,
                                sortKey: null!,
                                type: ContentModuleType.TITLE,
                                text: 'Titel',
                                files: [],
                            });
                        }}
                    />
                </Grid>
                <Grid item xs={2}>
                    <AddModuleButton
                        label={'Bild'}
                        icon={<AddPhotoAlternate />}
                        onClick={() => {
                            onAddModule({
                                id: new Date().getTime() + Math.random() * 1000,
                                sortKey: null!,
                                type: ContentModuleType.IMAGE,
                                text: undefined,
                                files: [],
                            });
                        }}
                    />
                </Grid>
                <Grid item xs={2}>
                    <AddModuleButton
                        label={'Video'}
                        icon={<MovieCreation />}
                        onClick={() => {
                            onAddModule({
                                id: new Date().getTime() + Math.random() * 1000,
                                sortKey: null!,
                                type: ContentModuleType.VIDEO,
                                text: undefined,
                                files: [],
                            });
                        }}
                    />
                </Grid>
                <Grid item xs={2}>
                    <AddModuleButton
                        label={'Audio'}
                        icon={<Audiotrack />}
                        onClick={() => {
                            onAddModule({
                                id: new Date().getTime() + Math.random() * 1000,
                                sortKey: null!,
                                type: ContentModuleType.AUDIO,
                                text: undefined,
                                files: [],
                            });
                        }}
                    />
                </Grid>
                <Grid item xs={2}>
                    <AddModuleButton
                        label={'Dateien'}
                        icon={<FileCopyOutlined />}
                        onClick={() => {
                            onAddModule({
                                id: new Date().getTime() + Math.random() * 1000,
                                sortKey: null!,
                                type: ContentModuleType.DOWNLOAD,
                                text: '[]',
                                files: [],
                            });
                        }}
                    />
                </Grid>
            </Grid>
        </div>
    );

});