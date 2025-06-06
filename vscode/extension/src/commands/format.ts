import { traceError, traceLog } from "../utilities/common/log"
import { execSync } from 'child_process'
import { sqlmesh_exec } from "../utilities/sqlmesh/sqlmesh"
import { isErr } from "../utilities/functional/result"

interface CLICallout {
    format: () => Promise<number>
}

export const actual_callout: CLICallout = {
    format: async () => {
        traceLog("Calling format")
        try {
            const exec = await sqlmesh_exec()
            if (isErr(exec)) {
                traceError(exec.error)
                return 1
            }
            execSync(`${exec.value.bin} format`, { encoding: 'utf-8', cwd: exec.value.workspacePath, env: exec.value.env })
            return 0
        } catch (error: any) {
            traceError('Error executing sqlmesh format:', error.message)
            traceError(error.stdout)
            traceError(error.stderr)
            return error.status || 1
        }
    }
}

