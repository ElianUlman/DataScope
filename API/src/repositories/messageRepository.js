import BaseRepository from "./baseRepository.js"

class messageRepository extends BaseRepository {
  constructor() {
    super("public.messages");
  }

  async getUsedAIs(id) {
    const { rows } = await this.query(`SELECT public.messages.platform 
      FROM public.messages INNER JOIN public.users ON public.users.id = public.messages.user_id
      INNER JOIN public.invites ON public.users.id = public.invites.userfk
      WHERE companyfk=$1`, [id])
    return rows
  }

  async getActivityVolumeByCompany(companyId, period = 'day') {
    const validPeriods = ['day', 'week', 'month']
    if (!validPeriods.includes(period)) throw new Error(`Período inválido: ${period}`)

    const { rows } = await this.query(`
      SELECT
        DATE_TRUNC($1, public.messages.created_at) AS period,
        COUNT(*) AS total_messages
      FROM public.messages
        INNER JOIN public.users ON public.users.id = public.messages.user_id
        INNER JOIN public.invites ON public.users.id = public.invites.userfk
      WHERE public.invites.companyfk = $2
        AND public.invites.isvalid = TRUE
      GROUP BY period
      ORDER BY period ASC
    `, [period, companyId])
    return rows
  }

  // Adopción de Plataformas de IA
  // Devuelve la cantidad y porcentaje de mensajes por plataforma (ia + model) para una empresa.
  async getPlatformAdoptionByCompany(companyId) {
    const { rows } = await this.query(`
      SELECT
        public.messages.platform,
        COUNT(*) AS total_messages,
        ROUND(
          COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2
        ) AS percentage
      FROM public.messages
        INNER JOIN public.users ON public.users.id = public.messages.user_id
        INNER JOIN public.invites ON public.users.id = public.invites.userfk
      WHERE public.invites.companyfk = $1
        AND public.invites.isvalid = TRUE
      GROUP BY public.messages.platform
      ORDER BY total_messages DESC
    `, [companyId])
    return rows
  }

  async getHourlyDistributionByCompany(companyId) {
    const { rows } = await this.query(`
      SELECT
        EXTRACT(HOUR FROM public.messages.created_at) AS hour,
        COUNT(*) AS total_messages
      FROM public.messages
        INNER JOIN public.users ON public.users.id = public.messages.user_id
        INNER JOIN public.invites ON public.users.id = public.invites.userfk
      WHERE public.invites.companyfk = $1
        AND public.invites.isvalid = TRUE
      GROUP BY hour
      ORDER BY hour ASC
    `, [companyId])
    return rows
  }

  async getAvgQueryComplexityByCompany(companyId) {
    const { rows } = await this.query(`
      SELECT
        ROUND(AVG(LENGTH(public.messages.content)), 2)                        AS avg_chars,
        ROUND(AVG(ARRAY_LENGTH(STRING_TO_ARRAY(TRIM(public.messages.content), ' '), 1)), 2) AS avg_words
      FROM public.messages
        INNER JOIN public.users ON public.users.id = public.messages.user_id
        INNER JOIN public.invites ON public.users.id = public.invites.userfk
      WHERE public.invites.companyfk = $1
        AND public.invites.isvalid = TRUE
    `, [companyId])
    return rows[0]
  }

  async getInteractionRateByCompany(companyId) {
    const { rows } = await this.query(`
      SELECT
        COUNT(*)                                    AS total_messages,
        COUNT(DISTINCT public.messages.user_id)     AS unique_users,
        ROUND(
          COUNT(*) * 1.0 / NULLIF(COUNT(DISTINCT public.messages.user_id), 0), 2
        )                                           AS avg_messages_per_user
      FROM public.messages
        INNER JOIN public.users ON public.users.id = public.messages.user_id
        INNER JOIN public.invites ON public.users.id = public.invites.userfk
      WHERE public.invites.companyfk = $1
        AND public.invites.isvalid = TRUE
    `, [companyId])
    return rows[0]
  }

}

export default new messageRepository();