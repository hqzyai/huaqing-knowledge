import { addParserConfigIssues } from '@/components/pipeline-operator-tabs/parser-config-validation';
import { DESCRIPTION_MAX_LENGTH } from '@/constants/common';
import { ParseType } from '@/constants/knowledge';
import { t } from 'i18next';
import { z } from 'zod';

export const formSchema = z
  .object({
    parse_type: z.literal(ParseType.BuiltIn),
    pipeline_id: z.string().optional(),
    pipeline_name: z.string().optional(),
    pipeline_avatar: z.string().optional(),
    name: z.string().min(1, {
      message: 'Username must be at least 2 characters.',
    }),
    description: z
      .string()
      .max(DESCRIPTION_MAX_LENGTH, {
        message: t('common.descriptionMaxLength', {
          max: DESCRIPTION_MAX_LENGTH,
        }),
      })
      .optional(),
    parser_id: z.string().trim().min(1, t('common.pleaseSelect')),
    avatar: z.any().nullish(),
    permission: z.string().optional(),
    language: z.string().optional(),
    embedding_model: z.string(),
    pagerank: z.number(),
    parser_config: z.record(z.string(), z.any()).optional(),
    connectors: z
      .array(
        z.object({
          id: z.string().optional(),
          name: z.string().optional(),
          source: z.string().optional(),
          ststus: z.string().optional(),
          auto_parse: z.string().optional(),
        }),
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    addParserConfigIssues(data.parser_config, ctx, t);
  });
