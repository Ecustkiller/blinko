<script setup>
import { useData, useRouter, useRoute } from 'vitepress'

const { lang } = useData()
const router = useRouter()
const route = useRoute()
router.go(route.path + lang.value)
</script>

